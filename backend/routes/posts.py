from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..db import get_db, engine
from ..security import require_roles, get_current_user

models.Base.metadata.create_all(bind=engine)

router = APIRouter()


@router.post("/union/{union_id}", response_model=schemas.Post)
def create_post_for_union(union_id: int, post: schemas.PostCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    """Create a post in a union. All authenticated users can create posts."""
    u = db.query(models.Union).filter(models.Union.id == union_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Union not found")
    new = models.Post(title=post.title, content=post.content, union_id=union_id)
    db.add(new)
    db.commit()
    db.refresh(new)
    # Initialize vote counts for new post
    new.upvotes = 0
    new.downvotes = 0
    return new


@router.get("/union/{union_id}", response_model=List[schemas.Post])
def list_posts_for_union(union_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    posts = db.query(models.Post).filter(models.Post.union_id == union_id).offset(skip).limit(limit).all()
    
    # Add vote counts to each post
    for post in posts:
        upvotes = db.query(models.PostVote).filter(
            models.PostVote.post_id == post.id,
            models.PostVote.vote_type == "up"
        ).count()
        downvotes = db.query(models.PostVote).filter(
            models.PostVote.post_id == post.id,
            models.PostVote.vote_type == "down"
        ).count()
        post.upvotes = upvotes
        post.downvotes = downvotes
    
    return posts


@router.get("/{post_id}", response_model=schemas.Post)
def get_post(post_id: int, db: Session = Depends(get_db)):
    p = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Add vote counts
    upvotes = db.query(models.PostVote).filter(
        models.PostVote.post_id == p.id,
        models.PostVote.vote_type == "up"
    ).count()
    downvotes = db.query(models.PostVote).filter(
        models.PostVote.post_id == p.id,
        models.PostVote.vote_type == "down"
    ).count()
    p.upvotes = upvotes
    p.downvotes = downvotes
    
    return p


# Comment endpoints
@router.post("/{post_id}/comments", response_model=schemas.Comment)
def create_comment(
    post_id: int,
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    """Create a comment on a post. All authenticated users can comment."""
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    new_comment = models.Comment(
        content=comment.content,
        post_id=post_id,
        user_id=user.id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment


@router.get("/{post_id}/comments", response_model=List[schemas.Comment])
def get_comments(
    post_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all comments for a post."""
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comments = db.query(models.Comment).filter(
        models.Comment.post_id == post_id
    ).order_by(models.Comment.created_at.asc()).offset(skip).limit(limit).all()
    
    return comments


@router.put("/comments/{comment_id}", response_model=schemas.Comment)
def update_comment(
    comment_id: int,
    comment_update: schemas.CommentUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    """Update a comment. Only the comment author can edit."""
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment.user_id != user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own comments")
    
    comment.content = comment_update.content
    db.commit()
    db.refresh(comment)
    return comment


@router.delete("/comments/{comment_id}", status_code=204)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    """Delete a comment. Only the comment author or admin can delete."""
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="You can only delete your own comments")
    
    db.delete(comment)
    db.commit()
    return None

