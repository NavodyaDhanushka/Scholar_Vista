from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MySQL Database URL from .env file
DATABASE_URL = os.getenv("MYSQL_URL", "mysql+pymysql://root:root@localhost/scholar_vista")

# Create database engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
