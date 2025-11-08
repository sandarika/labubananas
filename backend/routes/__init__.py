from fastapi import APIRouter

from .posts import router as posts_router
from .feedback import router as feedback_router
from .unions import router as unions_router
from .auth import router as auth_router
from .events import router as events_router
from .polls import router as polls_router
from .chatbot import router as chatbot_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(unions_router, prefix="/unions", tags=["unions"])
api_router.include_router(posts_router, prefix="/posts", tags=["posts"])
api_router.include_router(feedback_router, prefix="/feedbacks", tags=["feedbacks"])
api_router.include_router(events_router, prefix="/events", tags=["events"])
api_router.include_router(polls_router, prefix="/polls", tags=["polls"])
api_router.include_router(chatbot_router, prefix="/chatbot", tags=["chatbot"])
