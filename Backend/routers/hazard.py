from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
import datetime
import os
from fpdf import FPDF
from dotenv import load_dotenv
from fuzzywuzzy import process  # Import fuzzywuzzy for fuzzy matching

# Import Models & Schemas
from Backend.models.models import ResearchPaper
from Backend.models.db_models import SearchLog
from Backend.schemas.schemas import SearchLogSchema, SearchResponse, TrendingTopicsResponse, SearchLogRequest
from Backend.core.database import get_db

# Initialize Router
router = APIRouter()

# Load environment variables
load_dotenv()

# Ensure uploads directory exists
os.makedirs('uploads', exist_ok=True)

# ✅ Fetch Search Logs
@router.get("/search/logs", response_model=list[SearchLogSchema])
def get_search_logs(db: Session = Depends(get_db)):
    return db.query(SearchLog).all()


def find_closest_match(keyword: str, db: Session):
    """Find the closest matching keyword from titles, authors, or abstracts in the DB."""
    paper_data = db.query(ResearchPaper.title, ResearchPaper.author, ResearchPaper.introduction).all()
    all_keywords = [item for sublist in paper_data for item in sublist if item]

    if not all_keywords:
        return None

    best_match, score = process.extractOne(keyword, all_keywords)
    return best_match if score >= 70 else None  # Only return if similarity is above 70%

# ✅ Search for Research Papers
@router.post("/search", response_model=dict)
def search_paper(request: SearchLogRequest, db: Session = Depends(get_db)):
    """Search for a research paper in the database. If not found, suggest a possible match."""

    papers = db.query(ResearchPaper).filter(
        (ResearchPaper.title.ilike(f"%{request.keyword}%")) |
        (ResearchPaper.author.ilike(f"%{request.keyword}%")) |
        (ResearchPaper.introduction.ilike(f"%{request.keyword}%")) |
        (ResearchPaper.year.ilike(f"%{request.keyword}%"))
    ).all()

    if papers:
        log = SearchLog(keyword=request.keyword, found_in_db=True, date_searched=datetime.datetime.utcnow())
        db.add(log)
        db.commit()
        return {"results": [{
            "title": paper.title,
            "author": paper.author,
            "abstract": paper.introduction or "Abstract not available",
            "file_path": f"http://127.0.0.1:8005/uploads/{paper.file_path}" if paper.file_path else None,
            "source": "Database"
        } for paper in papers]}

    # No results found, check for closest match
    suggestion = find_closest_match(request.keyword, db)
    return {"results": [], "suggestion": suggestion} if suggestion else {"results": []}

# ✅ Fetch Trending Topics
@router.get("/trending", response_model=list[TrendingTopicsResponse])
def get_trending_topics(db: Session = Depends(get_db)):
    thirty_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=30)
    recent_logs = (
        db.query(SearchLog.keyword, func.count(SearchLog.keyword).label("count"))
        .filter(SearchLog.date_searched >= thirty_days_ago)
        .group_by(SearchLog.keyword)
        .order_by(func.count(SearchLog.keyword).desc())
        .limit(10)
        .all()
    )
    return [{"keyword": log[0], "count": log[1]} for log in recent_logs]

# ✅ Generate PDF Report
from fastapi.responses import FileResponse

@router.post("/generate_report")
def generate_pdf_report(db: Session = Depends(get_db)):
    topics = get_trending_topics(db)
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", style="B", size=16)
    pdf.cell(200, 10, "Trending Research Topics Report", ln=True, align='C')
    pdf.ln(10)

    pdf.set_font("Arial", size=12)
    for topic in topics:
        pdf.cell(200, 10, f"{topic['keyword']} - {topic['count']} searches", ln=True)

    filename = f"uploads/trending_topics_{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}.pdf"
    pdf.output(filename)

    # ✅ Return the file as a downloadable response
    return FileResponse(filename, media_type="application/pdf", filename="Trending_Report.pdf")

# ✅ Toggle "Found in DB" Status
@router.put("/search_logs/{log_id}", response_model=SearchLogSchema)
def update_search_log(log_id: int, db: Session = Depends(get_db)):
    search_log = db.query(SearchLog).filter(SearchLog.id == log_id).first()

    if not search_log:
        raise HTTPException(status_code=404, detail="Search log not found")

    search_log.found_in_db = not search_log.found_in_db
    db.commit()
    db.refresh(search_log)

    return search_log

# ✅ Delete Search Log
@router.delete("/search_logs/{log_id}")
def delete_search_log(log_id: int, db: Session = Depends(get_db)):
    search_log = db.query(SearchLog).filter(SearchLog.id == log_id).first()

    if not search_log:
        raise HTTPException(status_code=404, detail="Search log not found")

    db.delete(search_log)
    db.commit()

    return {"message": "Search log deleted"}
