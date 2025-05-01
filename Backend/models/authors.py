from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from Backend.core.database import Base


class Author(Base):
    __tablename__ = "authors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    affiliation = Column(String(200), nullable=True)
    email = Column(String(120), unique=True, nullable=False)
    areas_of_expertise = Column(Text, nullable=True)

    achievements = relationship("Achievement", back_populates="author", cascade="all, delete-orphan")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    year = Column(Integer, nullable=False)
    author_id = Column(Integer, ForeignKey("authors.id"), nullable=False)

    author = relationship("Author", back_populates="achievements")
