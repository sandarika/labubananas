from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Text, Table
from sqlalchemy.orm import relationship
from . import Base

# association table for event attendees
event_attendees = Table(
    "event_attendees",
    Base.metadata,
    Column("event_id", Integer, ForeignKey("events.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
)

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    union_id = Column(Integer, ForeignKey("unions.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    starts_at = Column(DateTime, nullable=False)
    ends_at = Column(DateTime, nullable=True)
    location = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    union = relationship("Union", back_populates="events")
    creator = relationship("User", back_populates="events_created")
    attendees = relationship("User", secondary=event_attendees, backref="events_attending")

    def to_dict(self, include_attendees: bool = False):
        d = {
            "id": self.id,
            "union_id": self.union_id,
            "creator_id": self.creator_id,
            "title": self.title,
            "description": self.description,
            "starts_at": self.starts_at.isoformat() if self.starts_at else None,
            "ends_at": self.ends_at.isoformat() if self.ends_at else None,
            "location": self.location,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_attendees:
            d["attendees"] = [a.to_dict() for a in self.attendees]
        return d

    def __repr__(self):
        return f"<Event id={self.id} title={self.title} starts_at={self.starts_at}>"
