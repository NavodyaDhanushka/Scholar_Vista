from sqlalchemy import Column, Integer, String, DateTime, Boolean, func
from Backend.core.database import Base

# Search Log Model
class SearchLog(Base):
    __tablename__ = "search_logs"

    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String(255), nullable=False)
    date_searched = Column(DateTime, default=func.now())
    found_in_db = Column(Boolean, default=False)
    updated = Column(Boolean, default=False)  # Field for tracking updates
    category = Column(String(100), nullable=True)  # Field for categorizing searches
