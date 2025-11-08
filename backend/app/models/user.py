from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from . import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(120), nullable=True)
    role = Column(String(50), default="member")
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    # relationships (strings used for lazy evaluation)
    unions = relationship("Union", secondary="user_unions", back_populates="members")
    messages_sent = relationship("Message", back_populates="sender", cascade="all, delete-orphan")
    polls_created = relationship("Poll", back_populates="creator")
    events_created = relationship("Event", back_populates="creator")

    def to_dict(self, include_email: bool = False):
        d = {
            "id": self.id,
            "username": self.username,
            "display_name": self.display_name,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_email:
            d["email"] = self.email
        return d

    def __repr__(self):
        return f"<User id={self.id} username={self.username}>"
