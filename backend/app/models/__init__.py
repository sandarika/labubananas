from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import event as sa_event
from datetime import datetime

Base = declarative_base()

# Small helper to set created_at and updated_at automatically if present
def _set_timestamp(mapper, connection, target):
    now = datetime.utcnow()
    if hasattr(target, "created_at") and target.created_at is None:
        target.created_at = now
    if hasattr(target, "updated_at"):
        target.updated_at = now

# Hook Base to listen for inserts and updates
@sa_event.listens_for(Base, "mapper_configured")
def _configure_listeners(mapper, class_):
    if hasattr(class_, "created_at") or hasattr(class_, "updated_at"):
        sa_event.listen(class_, "before_insert", _set_timestamp)
        sa_event.listen(class_, "before_update", _set_timestamp)

__all__ = ["Base"]
