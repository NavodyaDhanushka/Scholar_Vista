from pydantic import BaseModel
from datetime import datetime

# Schema for search log entry
class SearchLogSchema(BaseModel):
    id: int
    keyword: str
    date_searched: datetime
    found_in_db: bool
    updated: bool  # Added updated field
    category: str | None  # Added category field

    class Config:
        orm_mode = True

# Request schema for searching a paper
class SearchLogRequest(BaseModel):
    keyword: str

# Response schema for a search result
class SearchResponse(BaseModel):
    title: str
    author: str
    abstract: str
    source: str

# Response schema for trending topics
class TrendingTopicsResponse(BaseModel):
    keyword: str
    count: int
