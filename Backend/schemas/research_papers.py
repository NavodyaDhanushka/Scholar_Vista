from pydantic import BaseModel
from typing import Optional

# Schema for creating a research paper
class ResearchPaperCreate(BaseModel):
    title: str
    author: str
    year: int
    introduction: Optional[str]

# Schema for returning a research paper
class ResearchPaperResponse(ResearchPaperCreate):
    id: int
    file_path: str

    class Config:
        from_attributes = True  # ✅ Pydantic v2 Fix
