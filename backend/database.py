"""
Simple database connection for Household COO personal use.

Uses SQLite for easy setup and personal use.
No complex database server setup needed.
"""

import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError

def get_database_url():
    """Get database URL - using SQLite for simplicity."""
    return "sqlite:///./household_coo.db"

# ... rest of the file stays the same


# Create engine and session factory
engine = create_engine(get_database_url())
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    """Get database session for FastAPI dependency."""
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()


def test_connection() -> bool:
    """Test if database connection works."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except SQLAlchemyError:
        return False
