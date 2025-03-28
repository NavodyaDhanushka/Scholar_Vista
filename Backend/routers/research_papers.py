import os
import uuid
import re
import fitz
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from starlette.responses import FileResponse
from Backend.core.database import get_db
from Backend.dependencies.auth import get_current_user
from Backend.models.research_papers import ResearchPaper
from Backend.schemas.research_papers import ResearchPaperResponse

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 📌 Function to Extract Metadata from PDF
def extract_metadata_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = "\n".join([page.get_text("text") for page in doc])  # Extract text from all pages

    metadata = {}

    # Extract Title (Assume the first non-empty line is the title)
    title_match = re.search(r"(?m)^(.*?)(?:\n|$)", text)
    metadata["title"] = title_match.group(1).strip() if title_match else "Unknown Title"

    # Extract Authors (Look for a list of names near "University", "Department")
    author_match = re.search(r"(?m)^\s*(.+?)\n.*\b(?:University|Institute|Department|Faculty)\b", text)
    metadata["authors"] = author_match.group(1).strip() if author_match else "Unknown Authors"

    # Extract Year (Find a 4-digit year like 2020, 2021)
    year_match = re.search(r"\b(19\d{2}|20\d{2})\b", text)
    metadata["year"] = year_match.group(1) if year_match else "Unknown Year"

    # Extract Introduction (Find text after "Introduction" heading)
    intro_match = re.search(r"(?i)\bIntroduction\b(.*?)(?=\b(?:Methodology|Materials|Related Work|Background)\b)", text, re.DOTALL)
    metadata["introduction"] = intro_match.group(1).strip() if intro_match else "Introduction not found"

    return metadata


# 📌 Upload Research Paper (Admins Only)
@router.post("/upload/", response_model=ResearchPaperResponse)
async def upload_paper(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)  # Ensure user is admin
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can upload research papers")

    paper_id = str(uuid.uuid4())  # Generate unique ID
    file_path = os.path.join(UPLOAD_DIR, f"{paper_id}_{file.filename.replace(' ', '_')}")

    # Save the file locally
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract metadata
    metadata = extract_metadata_from_pdf(file_path)
    title, authors, year, introduction = metadata["title"], metadata["authors"], metadata["year"], metadata["introduction"]

    # Save to MySQL database
    new_paper = ResearchPaper(title=title, author=authors, year=year, introduction=introduction, file_path=file_path)
    db.add(new_paper)
    db.commit()
    db.refresh(new_paper)

    return new_paper


# 📌 View All Research Papers
@router.get("/papers/", response_model=list[ResearchPaperResponse])
async def get_all_papers(db: Session = Depends(get_db)):
    return db.query(ResearchPaper).all()


# 📌 View a Specific Research Paper
@router.get("/papers/{paper_id}", response_model=ResearchPaperResponse)
async def get_paper(paper_id: int, db: Session = Depends(get_db)):
    paper = db.query(ResearchPaper).filter(ResearchPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper


# 📌 Update Research Paper Details (Admins Only)
@router.put("/papers/{paper_id}")
async def update_paper(
    paper_id: int,
    title: str = Form(None),
    author: str = Form(None),
    year: int = Form(None),
    introduction: str = Form(None),
    db: Session = Depends(get_db)
):
    paper = db.query(ResearchPaper).filter(ResearchPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    # Update fields if new values are provided
    if title:
        paper.title = title
    if author:
        paper.author = author
    if year:
        paper.year = year
    if introduction:
        paper.introduction = introduction

    db.commit()
    db.refresh(paper)

    return {"message": "Paper updated successfully", "paper": paper}

# 📌 Delete Research Paper (Admins Only)
@router.delete("/papers/{paper_id}")
async def delete_paper(paper_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Check if user is admin
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can delete research papers")

    paper = db.query(ResearchPaper).filter(ResearchPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    # Delete the file from the server
    if os.path.exists(paper.file_path):
        os.remove(paper.file_path)

    # Delete from MySQL
    db.delete(paper)
    db.commit()

    return {"message": "Paper deleted successfully"}

@router.get("/download/{filename}")
async def download_file(filename: str):
    file_path = f"uploads/{filename}"  # Adjust path based on where PDFs are stored
    return FileResponse(file_path, filename=filename, media_type="application/pdf")