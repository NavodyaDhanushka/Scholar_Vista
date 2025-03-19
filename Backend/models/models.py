from sqlalchemy import Column, Integer, String, Text
from Backend.core.database import Base


class ResearchPaper(Base):
    __tablename__ = "research_papers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    year = Column(Integer, nullable=False)
    introduction = Column(Text, nullable=True)  # ✅ Add Introduction Column
    file_path = Column(String(255), nullable=False)  # Store PDF file path
