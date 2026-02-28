"""
Simple database connection for Household COO personal use.

Minimal SQLite setup - just what's needed for personal use.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from models import Base

# Simple database setup
engine = create_engine("sqlite:///./household_coo.db")
SessionLocal = sessionmaker(bind=engine)

# Create tables on import
Base.metadata.create_all(engine)

def get_db() -> Session:
    """Get database session for FastAPI dependency."""
    return SessionLocal()
