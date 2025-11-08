from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..db import get_db, engine
from ..security import require_roles

models.Base.metadata.create_all(bind=engine)

router = APIRouter()


@router.post("/union/{union_id}", response_model=schemas.Post, dependencies=[Depends(require_roles(["organizer", "admin"]))])
def create_post_for_union(union_id: int, post: schemas.PostCreate, db: Session = Depends(get_db)):
    u = db.query(models.Union).filter(models.Union.id == union_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Union not found")
    new = models.Post(title=post.title, content=post.content, union_id=union_id)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@router.get("/union/{union_id}", response_model=List[schemas.Post])
def list_posts_for_union(union_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Post).filter(models.Post.union_id == union_id).offset(skip).limit(limit).all()


@router.get("/{post_id}", response_model=schemas.Post)
def get_post(post_id: int, db: Session = Depends(get_db)):
    p = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    return p
