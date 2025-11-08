from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Text, Boolean, Table
from sqlalchemy.orm import relationship
from . import Base

class Poll(Base):
    __tablename__ = "polls"

    id = Column(Integer, primary_key=True)
    union_id = Column(Integer, ForeignKey("unions.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question = Column(Text, nullable=False)
    allow_multiple = Column(Boolean, default=False)
    ends_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    options = relationship("PollOption", back_populates="poll", cascade="all, delete-orphan")
    votes = relationship("PollVote", back_populates="poll", cascade="all, delete-orphan")
    union = relationship("Union", back_populates="polls")
    creator = relationship("User", back_populates="polls_created")

    def to_dict(self, include_options: bool = True):
        d = {
            "id": self.id,
            "union_id": self.union_id,
            "creator_id": self.creator_id,
            "question": self.question,
            "allow_multiple": self.allow_multiple,
            "ends_at": self.ends_at.isoformat() if self.ends_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_options:
            d["options"] = [o.to_dict(include_votes=False) for o in self.options]
        return d

class PollOption(Base):
    __tablename__ = "poll_options"

    id = Column(Integer, primary_key=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    label = Column(String(255), nullable=False)

    poll = relationship("Poll", back_populates="options")
    votes = relationship("PollVote", back_populates="option", cascade="all, delete-orphan")

    def to_dict(self, include_votes: bool = False):
        d = {"id": self.id, "poll_id": self.poll_id, "label": self.label}
        if include_votes:
            d["votes"] = [v.to_dict() for v in self.votes]
        return d

class PollVote(Base):
    __tablename__ = "poll_votes"

    id = Column(Integer, primary_key=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    option_id = Column(Integer, ForeignKey("poll_options.id"), nullable=False)
    voter_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    poll = relationship("Poll", back_populates="votes")
    option = relationship("PollOption", back_populates="votes")

    def to_dict(self):
        return {"id": self.id, "poll_id": self.poll_id, "option_id": self.option_id, "voter_id": self.voter_id}
