from collections import Counter
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..db import get_db
from ..security import require_roles, get_current_user

router = APIRouter()


@router.post("/", response_model=schemas.Poll, dependencies=[Depends(require_roles(["organizer", "admin"]))])
def create_poll(poll_in: schemas.PollCreate, db: Session = Depends(get_db)):
    if not poll_in.options or len(poll_in.options) < 2:
        raise HTTPException(status_code=400, detail="A poll requires at least two options")
    poll = models.Poll(question=poll_in.question, union_id=poll_in.union_id)
    db.add(poll)
    db.flush()  # get poll.id before adding options
    for opt in poll_in.options:
        db.add(models.PollOption(poll_id=poll.id, text=opt.text))
    db.commit()
    db.refresh(poll)
    return poll


@router.get("/", response_model=List[schemas.Poll])
def list_polls(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(models.Poll).order_by(models.Poll.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/{poll_id}/vote", response_model=schemas.PollResults)
def vote_poll(poll_id: int, vote_in: schemas.VoteCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    option = db.query(models.PollOption).filter(models.PollOption.id == vote_in.option_id, models.PollOption.poll_id == poll_id).first()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found for this poll")

    # check if already voted
    already = db.query(models.Vote).filter(models.Vote.poll_id == poll_id, models.Vote.user_id == user.id).first()
    if already:
        raise HTTPException(status_code=400, detail="User already voted in this poll")

    vote = models.Vote(poll_id=poll_id, option_id=option.id, user_id=user.id)
    db.add(vote)
    db.commit()

    return poll_results(poll_id, db)


@router.get("/{poll_id}/results", response_model=schemas.PollResults)
def poll_results(poll_id: int, db: Session = Depends(get_db)):
    poll = db.query(models.Poll).filter(models.Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    options = db.query(models.PollOption).filter(models.PollOption.poll_id == poll_id).all()
    votes = db.query(models.Vote).filter(models.Vote.poll_id == poll_id).all()

    counts = Counter([v.option_id for v in votes])
    result_options = [
        schemas.PollResultOption(option_id=o.id, text=o.text, votes=counts.get(o.id, 0)) for o in options
    ]
    return schemas.PollResults(poll_id=poll.id, question=poll.question, results=result_options)
