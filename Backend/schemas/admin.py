from pydantic import BaseModel

# Admin Registration Schema
class AdminCreate(BaseModel):
    name: str
    email: str
    username: str
    password: str

# Admin Login Schema
class AdminLogin(BaseModel):
    username: str
    password: str

# Admin Response Schema
class AdminResponse(BaseModel):
    id: int
    name: str
    email: str
    username: str

    class Config:
        from_attributes = True  # ✅ Pydantic v2 Fix
