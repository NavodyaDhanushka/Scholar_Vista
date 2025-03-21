from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from Backend.core.database import get_db
from Backend.models.admin import Admin

router = APIRouter()

SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # ✅ Define this!

fake_users_db = {
    "admin@example.com": {"email": "admin@example.com", "password": "admin123", "role": "admin"},
    "user@example.com": {"email": "user@example.com", "password": "user123", "role": "user"},
}


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):  # ✅ Now this works!
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")  # Ensure the role exists

        db_admin = db.query(Admin).filter(Admin.username == username).first()
        if not db_admin:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized User")
        return {"username": username, "role": role}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or user["password"] != form_data.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer"}
