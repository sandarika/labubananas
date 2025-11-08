from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .routes import api_router
from .models import Base  # ensure models are imported
from .db import get_db


# Use a separate SQLite DB file for tests to avoid polluting local dev DB
TEST_DB_URL = "sqlite:///./test_api.db"

engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables fresh for tests
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)


def get_test_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI(title="Bunch Up API (Test)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

# Override the default DB dependency with test DB
app.dependency_overrides[get_db] = get_test_db


@app.get("/")
def read_root():
    return {"message": "Bunch Up backend (test) is running"}
