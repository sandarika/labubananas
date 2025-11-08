from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..db import get_db, engine
from ..security import get_current_user

models.Base.metadata.create_all(bind=engine)

router = APIRouter()


@router.post("/post/{post_id}", response_model=schemas.Feedback)
def create_feedback_for_post(post_id: int, feedback: schemas.FeedbackCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    p = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    new = models.Feedback(post_id=post_id, message=feedback.message, anonymous=feedback.anonymous)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@router.get("/post/{post_id}", response_model=List[schemas.Feedback])
def list_feedback_for_post(post_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Feedback).filter(models.Feedback.post_id == post_id).offset(skip).limit(limit).all()
