from fastapi import FastAPI
from .routes import api_router
from .db import engine, Base

# Make sure models are imported so SQLAlchemy can create tables
from . import models  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bunch Up API")
app.include_router(api_router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Bunch Up backend is running"}
