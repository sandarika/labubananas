from sqlalchemy import Column, Integer, String, Text, Table, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base

# association table for many-to-many between users and unions
user_unions = Table(
    "user_unions",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("union_id", Integer, ForeignKey("unions.id"), primary_key=True),
)

class Union(Base):
    __tablename__ = "unions"

    id = Column(Integer, primary_key=True)
    name = Column(String(150), unique=True, nullable=False)
    slug = Column(String(180), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    # relationships
    members = relationship("User", secondary=user_unions, back_populates="unions")
    organizer = relationship("User", backref="organized_unions", foreign_keys=[organizer_id])
    messages = relationship("Message", back_populates="union", cascade="all, delete-orphan")
    polls = relationship("Poll", back_populates="union", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="union", cascade="all, delete-orphan")

    def to_dict(self, include_members: bool = False):
        d = {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "organizer_id": self.organizer_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_members:
            d["members"] = [m.to_dict() for m in self.members]
        return d

    def __repr__(self):
        return f"<Union id={self.id} name={self.name}>"
