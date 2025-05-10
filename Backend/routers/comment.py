from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from Backend.schemas.comment import CommentResponse, CommentCreate, CommentUpdate
from Backend.models.comment import Comment
from Backend.core.database import get_db

router = APIRouter()

@router.post("/", response_model=CommentResponse)
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    db_comment = Comment(
        name=comment.name or "Anonymous",
        comment=comment.comment,
        paper_id=comment.paper_id,  # ➕ Associate with paper
        paper_title=comment.paper_title
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/paper/{paper_id}", response_model=List[CommentResponse])
def get_comments_for_paper(paper_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Comment)
        .filter(Comment.paper_id == paper_id, Comment.approved == True)
        .order_by(Comment.created_at.desc())
        .all()
    )

@router.get("/", response_model=List[CommentResponse])
def get_comments(db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.approved == True).order_by(Comment.likes.desc(), Comment.created_at.desc()).all()

@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(comment_id: int, updated_comment: CommentUpdate, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    comment.name = updated_comment.name or comment.name or "Anonymous"
    comment.comment = updated_comment.comment
    db.commit()
    db.refresh(comment)
    return comment


@router.delete("/{comment_id}", status_code=204)
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
    return

@router.post("/{comment_id}/like", response_model=CommentResponse)
def like_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    comment.likes += 1
    db.commit()
    db.refresh(comment)
    return comment

@router.post("/{comment_id}/dislike", response_model=CommentResponse)
def dislike_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    comment.dislikes += 1
    db.commit()
    db.refresh(comment)
    return comment

# Admin: Get all comments (approved + unapproved)
@router.get("/moderation", response_model=List[CommentResponse])
def get_all_comments(db: Session = Depends(get_db)):
    return db.query(Comment).order_by(Comment.created_at.desc()).all()

@router.post("/{comment_id}/approve", response_model=CommentResponse)
def approve_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    comment.approved = True
    db.commit()
    db.refresh(comment)
    return comment

@router.get("/{comment_id}", response_model=CommentResponse)
def get_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment
