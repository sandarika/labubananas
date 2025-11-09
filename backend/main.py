from dotenv import load_dotenv
from fastapi import FastAPI
import os

# Load environment variables from .env (if present) so backend reads config from
# the repository root during development.
load_dotenv()
from fastapi.middleware.cors import CORSMiddleware
from .routes import api_router
from .db import engine, Base

# Make sure models are imported so SQLAlchemy can create tables
from . import models  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bunch Up API", description="API backend for Bunch Up labor organization platform")

# Basic CORS setup for local dev; adjust origins for production security.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with explicit frontend domain(s) later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Bunch Up backend is running"}
