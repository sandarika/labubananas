import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL for local development or production. If DATABASE_URL is set in
# the environment (e.g. postgres), use that. Otherwise, fall back to an
# absolute SQLite file located in the backend package for easy local dev.
BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "test.db")
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
else:
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# For SQLite we need the check_same_thread connect arg; other DBs don't need it.
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency that yields a SQLAlchemy session and ensures it is closed.

    Using SessionLocal() here is fine. The absolute DB path ensures the DB ends
    up in the backend package directory regardless of the caller's cwd.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
