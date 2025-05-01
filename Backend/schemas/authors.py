from pydantic import BaseModel, EmailStr
from typing import List, Optional

# Achievement Schema
class AchievementBase(BaseModel):
    description: str
    year: int

class AchievementCreate(AchievementBase):
    pass

class AchievementResponse(AchievementBase):
    id: int

    class Config:
        orm_mode = True

# Author Schema
class AuthorBase(BaseModel):
    name: str
    affiliation: Optional[str] = None
    email: EmailStr
    areas_of_expertise: Optional[str] = None

class AuthorCreate(AuthorBase):
    pass

class AuthorUpdate(AuthorBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class AuthorResponse(AuthorBase):
    id: int
    achievements: List[AchievementResponse] = []

    class Config:
        orm_mode = True
