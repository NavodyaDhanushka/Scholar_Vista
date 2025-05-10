from pydantic import BaseModel
from typing import Optional
from datetime import datetime



class CommentCreate(BaseModel):
    name: Optional[str] = "Anonymous"
    comment: str
    paper_id: int  # ➕ Required to associate comment with a paper
    paper_title: Optional[str]

class CommentUpdate(BaseModel):
        name: Optional[str] = None
        comment: str

class CommentResponse(CommentCreate):
    id: int
    created_at: datetime
    likes: int
    dislikes: int
    approved: bool




    model_config = {
        "from_attributes": True  # replaces 'orm_mode = True' in Pydantic v2
    }
