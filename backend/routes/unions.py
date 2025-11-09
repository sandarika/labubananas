from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from .. import models, schemas
from ..db import get_db, engine
from ..security import require_roles, get_current_user, get_current_user_optional

# Ensure tables exist when router is imported in simple setups
models.Base.metadata.create_all(bind=engine)

router = APIRouter()


@router.post("/", response_model=schemas.Union, dependencies=[Depends(require_roles(["organizer", "admin"]))])
def create_union(union: schemas.UnionCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Union).filter(models.Union.name == union.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Union already exists")
    new = models.Union(
        name=union.name, 
        description=union.description,
        industry=union.industry,
        tags=union.tags
    )
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@router.get("/", response_model=List[schemas.Union])
def list_unions(
    skip: int = 0, 
    limit: int = 100, 
    industry: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional)
):
    query = db.query(models.Union)
    
    # Filter by industry if provided
    if industry:
        query = query.filter(models.Union.industry == industry)
    
    # Search by name or description if provided
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (models.Union.name.ilike(search_filter)) | 
            (models.Union.description.ilike(search_filter)) |
            (models.Union.tags.ilike(search_filter))
        )
    
    unions = query.offset(skip).limit(limit).all()
    
    # Add member count and is_member flag for each union
    result = []
    for union in unions:
        member_count = db.query(func.count(models.UnionMember.id)).filter(
            models.UnionMember.union_id == union.id
        ).scalar()
        
        # Only check membership if user is authenticated
        is_member = False
        if current_user:
            is_member = db.query(models.UnionMember).filter(
                models.UnionMember.union_id == union.id,
                models.UnionMember.user_id == current_user.id
            ).first() is not None
        
        union_dict = {
            "id": union.id,
            "name": union.name,
            "description": union.description,
            "industry": union.industry,
            "tags": union.tags,
            "created_at": union.created_at,
            "posts": union.posts,
            "member_count": member_count,
            "is_member": is_member
        }
        result.append(schemas.Union(**union_dict))
    
    return result


@router.get("/industries")
def list_industries(db: Session = Depends(get_db)):
    """Get all unique industries - no authentication required"""
    industries = db.query(models.Union.industry).distinct().filter(
        models.Union.industry.isnot(None)
    ).all()
    return [i[0] for i in industries if i[0]]


@router.get("/{union_id}", response_model=schemas.Union)
def get_union(
    union_id: int, 
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional)
):
    u = db.query(models.Union).filter(models.Union.id == union_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Union not found")
    
    # Add member count and is_member flag
    member_count = db.query(func.count(models.UnionMember.id)).filter(
        models.UnionMember.union_id == union_id
    ).scalar()
    
    # Only check membership if user is authenticated
    is_member = False
    if current_user:
        is_member = db.query(models.UnionMember).filter(
            models.UnionMember.union_id == union_id,
            models.UnionMember.user_id == current_user.id
        ).first() is not None
    
    union_dict = {
        "id": u.id,
        "name": u.name,
        "description": u.description,
        "industry": u.industry,
        "tags": u.tags,
        "created_at": u.created_at,
        "posts": u.posts,
        "member_count": member_count,
        "is_member": is_member
    }
    
    return schemas.Union(**union_dict)


@router.post("/{union_id}/join")
def join_union(
    union_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Join a union"""
    # Check if union exists
    union = db.query(models.Union).filter(models.Union.id == union_id).first()
    if not union:
        raise HTTPException(status_code=404, detail="Union not found")
    
    # Check if already a member
    existing = db.query(models.UnionMember).filter(
        models.UnionMember.union_id == union_id,
        models.UnionMember.user_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already a member of this union")
    
    # Create membership
    membership = models.UnionMember(union_id=union_id, user_id=current_user.id)
    db.add(membership)
    db.commit()
    
    return {"message": f"Successfully joined {union.name}"}


@router.delete("/{union_id}/leave")
def leave_union(
    union_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Leave a union"""
    # Check if union exists
    union = db.query(models.Union).filter(models.Union.id == union_id).first()
    if not union:
        raise HTTPException(status_code=404, detail="Union not found")
    
    # Check if member
    membership = db.query(models.UnionMember).filter(
        models.UnionMember.union_id == union_id,
        models.UnionMember.user_id == current_user.id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=400, detail="Not a member of this union")
    
    # Remove membership
    db.delete(membership)
    db.commit()
    
    return {"message": f"Successfully left {union.name}"}


@router.get("/{union_id}/members")
def get_union_members(
    union_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get members of a union"""
    union = db.query(models.Union).filter(models.Union.id == union_id).first()
    if not union:
        raise HTTPException(status_code=404, detail="Union not found")
    
    members = db.query(models.User).join(models.UnionMember).filter(
        models.UnionMember.union_id == union_id
    ).offset(skip).limit(limit).all()
    
    return [{"id": m.id, "username": m.username, "role": m.role} for m in members]
