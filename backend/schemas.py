from pydantic import BaseModel
from typing import Optional, List
import datetime


class FeedbackCreate(BaseModel):
    message: str
    anonymous: Optional[bool] = False


class Feedback(BaseModel):
    id: int
    post_id: int
    anonymous: bool
    message: str
    created_at: datetime.datetime

    class Config:
        orm_mode = True


class PostCreate(BaseModel):
    title: str
    content: str


class Post(BaseModel):
    id: int
    title: str
    content: str
    union_id: Optional[int]
    created_at: datetime.datetime
    feedbacks: List[Feedback] = []

    class Config:
        orm_mode = True


class UnionCreate(BaseModel):
    name: str
    description: Optional[str] = None


class Union(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime.datetime
    posts: List[Post] = []

    class Config:
        orm_mode = True
