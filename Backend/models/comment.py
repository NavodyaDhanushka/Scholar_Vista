from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from datetime import datetime

from sqlalchemy.orm import relationship

from Backend.core.database import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Anonymous")
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    likes = Column(Integer, default=0)
    dislikes = Column(Integer, default=0)
    approved = Column(Boolean, default=False)
    paper_title = Column(String(255), nullable=False)  # ✅ New column
    paper_id = Column(Integer, ForeignKey("research_papers.id"), nullable=False)  # 🔗 FK to research paper
    paper = relationship("ResearchPaper", back_populates="comments")
