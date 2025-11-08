from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..db import get_db, engine

# Ensure tables exist when router is imported in simple setups
models.Base.metadata.create_all(bind=engine)

router = APIRouter()


@router.post("/", response_model=schemas.Union)
def create_union(union: schemas.UnionCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Union).filter(models.Union.name == union.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Union already exists")
    new = models.Union(name=union.name, description=union.description)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@router.get("/", response_model=List[schemas.Union])
def list_unions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Union).offset(skip).limit(limit).all()


@router.get("/{union_id}", response_model=schemas.Union)
def get_union(union_id: int, db: Session = Depends(get_db)):
    u = db.query(models.Union).filter(models.Union.id == union_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Union not found")
    return u
