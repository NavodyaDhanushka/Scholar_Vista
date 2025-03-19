import os
from datetime import datetime, timedelta

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt
from sqlalchemy.orm import Session
from Backend.core.database import get_db
from Backend.models.admin import Admin
from Backend.schemas.admin import AdminResponse, AdminCreate, AdminLogin

router = APIRouter()

# Secret Key & Algorithm for JWT
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"

# 📌 Hash Password
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

# 📌 Verify Password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# 📌 Generate JWT Token
def create_jwt_token(admin_id: int, username: str):
    expire = datetime.utcnow() + timedelta(hours=24)
    payload = {"sub": username, "admin_id": admin_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# 📌 Admin Registration
@router.post("/register/", response_model=AdminResponse)
async def register_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    existing_admin = db.query(Admin).filter(Admin.username == admin.username).first()
    if existing_admin:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

    hashed_password = hash_password(admin.password)
    new_admin = Admin(name=admin.name, email=admin.email, username=admin.username, password_hash=hashed_password)
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return new_admin

# 📌 Admin Login
@router.post("/login/")
async def login_admin(admin: AdminLogin, db: Session = Depends(get_db)):
    db_admin = db.query(Admin).filter(Admin.username == admin.username).first()
    if not db_admin or not verify_password(admin.password, db_admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_jwt_token(db_admin.id, db_admin.username)
    return {"access_token": token, "token_type": "bearer"}
