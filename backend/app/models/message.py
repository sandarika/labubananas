from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from . import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    union_id = Column(Integer, ForeignKey("unions.id"), nullable=True)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    content = Column(Text, nullable=False)
    is_anonymous = Column(Boolean, default=False)
    attachments = Column(JSON, nullable=True)  # list of attachment metadata

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    # relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="messages_sent")
    union = relationship("Union", back_populates="messages")
    recipient = relationship("User", foreign_keys=[recipient_id])

    def to_dict(self, redact_sender: bool = False):
        d = {
            "id": self.id,
            "union_id": self.union_id,
            "recipient_id": self.recipient_id,
            "content": self.content,
            "is_anonymous": self.is_anonymous,
            "attachments": self.attachments,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if not redact_sender:
            d["sender"] = self.sender.to_dict()
        else:
            d["sender"] = {"id": None, "display_name": "Anonymous"} if self.is_anonymous else {"id": self.sender.id}
        return d

    def __repr__(self):
        return f"<Message id={self.id} sender_id={self.sender_id} union_id={self.union_id}>"
