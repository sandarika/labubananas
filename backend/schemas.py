from pydantic import BaseModel
from typing import Optional, List, ForwardRef
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


# Comment User Schema
class CommentUser(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True


# Comment Schema
class CommentCreate(BaseModel):
    content: str


class CommentUpdate(BaseModel):
    content: str


class Comment(BaseModel):
    id: int
    content: str
    post_id: int
    user_id: int
    user: CommentUser
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        orm_mode = True


# Post Schemas
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
    comments: List[Comment] = []

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


# Auth & Users
class UserCreate(BaseModel):
    username: str
    password: str
    role: Optional[str] = "member"


class User(BaseModel):
    id: int
    username: str
    role: str
    created_at: datetime.datetime

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Events
class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    start_time: datetime.datetime
    end_time: Optional[datetime.datetime] = None
    union_id: Optional[int] = None


class EventCreator(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True


class Event(BaseModel):
    id: int
    title: str
    description: Optional[str]
    location: Optional[str]
    start_time: datetime.datetime
    end_time: Optional[datetime.datetime]
    union_id: Optional[int]
    creator_id: int
    creator: EventCreator
    created_at: datetime.datetime
    attendee_count: int = 0

    class Config:
        orm_mode = True


# Polls & Voting
class PollOptionCreate(BaseModel):
    text: str


class PollCreate(BaseModel):
    question: str
    union_id: Optional[int] = None
    options: List[PollOptionCreate]


class PollOption(BaseModel):
    id: int
    text: str

    class Config:
        orm_mode = True


class Poll(BaseModel):
    id: int
    question: str
    union_id: Optional[int]
    created_at: datetime.datetime
    options: List[PollOption]

    class Config:
        orm_mode = True


class VoteCreate(BaseModel):
    option_id: int


class PollResultOption(BaseModel):
    option_id: int
    text: str
    votes: int


class PollResults(BaseModel):
    poll_id: int
    question: str
    results: List[PollResultOption]

