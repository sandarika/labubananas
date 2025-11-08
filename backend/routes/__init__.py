from fastapi import APIRouter

from .posts import router as posts_router
from .feedback import router as feedback_router
from .unions import router as unions_router

api_router = APIRouter()

api_router.include_router(unions_router, prefix="/unions", tags=["unions"])
api_router.include_router(posts_router, prefix="/posts", tags=["posts"])
api_router.include_router(feedback_router, prefix="/feedbacks", tags=["feedbacks"])
