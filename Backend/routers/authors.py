from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from Backend.core.database import get_db
from Backend.models.authors import Author, Achievement
from Backend.schemas.authors import AuthorCreate, AuthorResponse, AuthorUpdate, AchievementCreate, AchievementResponse

router = APIRouter()

# 📌 Add a New Author
@router.post("/authors/", response_model=AuthorResponse, status_code=status.HTTP_201_CREATED)
def create_author(author: AuthorCreate, db: Session = Depends(get_db)):
    existing_author = db.query(Author).filter(Author.email == author.email).first()
    if existing_author:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_author = Author(**author.dict())
    db.add(new_author)
    db.commit()
    db.refresh(new_author)
    return new_author

# 📌 Get Author by ID
@router.get("/authors/{author_id}", response_model=AuthorResponse)
def get_author(author_id: int, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return author

# 📌 Update an Author
@router.put("/authors/{author_id}", response_model=AuthorResponse)
def update_author(author_id: int, author_update: AuthorUpdate, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    for key, value in author_update.dict(exclude_unset=True).items():
        setattr(author, key, value)

    db.commit()
    db.refresh(author)
    return author

# 📌 Delete an Author
@router.delete("/authors/{author_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_author(author_id: int, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    db.delete(author)
    db.commit()
    return {"message": "Author deleted successfully"}

# 📌 Add an Achievement to an Author
@router.post("/authors/{author_id}/achievements/", response_model=AchievementResponse, status_code=status.HTTP_201_CREATED)
def add_achievement(author_id: int, achievement: AchievementCreate, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    new_achievement = Achievement(**achievement.dict(), author_id=author_id)
    db.add(new_achievement)
    db.commit()
    db.refresh(new_achievement)
    return new_achievement

# 📌 Delete an Achievement
@router.delete("/achievements/{achievement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_achievement(achievement_id: int, db: Session = Depends(get_db)):
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")

    db.delete(achievement)
    db.commit()
    return {"message": "Achievement deleted successfully"}

@router.get("/authors", response_model=list[AuthorResponse])
def get_all_authors(db: Session = Depends(get_db)):
    authors = db.query(Author).all()
    if not authors:
        raise HTTPException(status_code=404, detail="No authors found")
    return authors
