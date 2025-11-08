from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from .. import models, schemas
from ..db import get_db
from ..security import require_roles, get_current_user

router = APIRouter()


@router.post("/", response_model=schemas.Event, dependencies=[Depends(require_roles(["organizer", "admin"]))])
def create_event(event_in: schemas.EventCreate, db: Session = Depends(get_db)):
    if event_in.end_time and event_in.end_time < event_in.start_time:
        raise HTTPException(status_code=400, detail="end_time must be after start_time")
    evt = models.Event(
        title=event_in.title,
        description=event_in.description,
        start_time=event_in.start_time,
        end_time=event_in.end_time,
        union_id=event_in.union_id,
    )
    db.add(evt)
    db.commit()
    db.refresh(evt)
    return evt


@router.get("/", response_model=List[schemas.Event])
def list_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Event).order_by(models.Event.start_time.desc()).offset(skip).limit(limit).all()
