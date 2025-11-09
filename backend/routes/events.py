from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from .. import models, schemas
from ..db import get_db
from ..security import require_roles, get_current_user

router = APIRouter()


@router.post("/", response_model=schemas.Event, dependencies=[Depends(require_roles(["organizer", "admin"]))])
def create_event(
    event_in: schemas.EventCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if event_in.end_time and event_in.end_time < event_in.start_time:
        raise HTTPException(status_code=400, detail="end_time must be after start_time")
    evt = models.Event(
        title=event_in.title,
        description=event_in.description,
        location=event_in.location,
        start_time=event_in.start_time,
        end_time=event_in.end_time,
        union_id=event_in.union_id,
        creator_id=current_user.id,
    )
    db.add(evt)
    db.commit()
    db.refresh(evt)
    
    # Add attendee count
    evt.attendee_count = len(evt.attendees)
    return evt


@router.get("/", response_model=List[schemas.Event])
def list_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = db.query(models.Event).order_by(models.Event.start_time.desc()).offset(skip).limit(limit).all()
    # Add attendee count to each event
    for event in events:
        event.attendee_count = len(event.attendees)
    return events


@router.get("/{event_id}", response_model=schemas.Event)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.attendee_count = len(event.attendees)
    return event


@router.put("/{event_id}", response_model=schemas.Event)
def update_event(
    event_id: int, 
    event_in: schemas.EventCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if user is the creator or an admin
    if event.creator_id != current_user.id and current_user.role not in ["admin", "organizer"]:
        raise HTTPException(status_code=403, detail="Only the event creator or admins can edit this event")
    
    if event_in.end_time and event_in.end_time < event_in.start_time:
        raise HTTPException(status_code=400, detail="end_time must be after start_time")
    
    event.title = event_in.title
    event.description = event_in.description
    event.location = event_in.location
    event.start_time = event_in.start_time
    event.end_time = event_in.end_time
    event.union_id = event_in.union_id
    
    db.commit()
    db.refresh(event)
    event.attendee_count = len(event.attendees)
    return event


@router.delete("/{event_id}")
def delete_event(
    event_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if user is the creator or an admin
    if event.creator_id != current_user.id and current_user.role not in ["admin", "organizer"]:
        raise HTTPException(status_code=403, detail="Only the event creator or admins can delete this event")
    
    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}


@router.post("/{event_id}/rsvp")
def rsvp_to_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if already RSVP'd
    existing = db.query(models.EventAttendee).filter(
        models.EventAttendee.event_id == event_id,
        models.EventAttendee.user_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already RSVP'd to this event")
    
    attendee = models.EventAttendee(
        event_id=event_id,
        user_id=current_user.id
    )
    db.add(attendee)
    db.commit()
    
    return {"message": "RSVP successful", "attendee_count": len(event.attendees)}


@router.delete("/{event_id}/rsvp")
def cancel_rsvp(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    attendee = db.query(models.EventAttendee).filter(
        models.EventAttendee.event_id == event_id,
        models.EventAttendee.user_id == current_user.id
    ).first()
    
    if not attendee:
        raise HTTPException(status_code=404, detail="RSVP not found")
    
    db.delete(attendee)
    db.commit()
    
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    return {"message": "RSVP cancelled", "attendee_count": len(event.attendees) if event else 0}


@router.get("/{event_id}/attendees")
def get_event_attendees(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    attendees = db.query(models.EventAttendee).filter(
        models.EventAttendee.event_id == event_id
    ).all()
    
    return {
        "event_id": event_id,
        "attendee_count": len(attendees),
        "attendees": [{"user_id": a.user_id, "username": a.user.username} for a in attendees]
    }
