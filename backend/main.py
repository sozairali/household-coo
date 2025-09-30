"""
Simple FastAPI app for Household COO personal use.

Just provides basic API endpoints for the frontend.
"""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, test_connection

app = FastAPI(title="Household COO", version="1.0.0")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Basic health check."""
    return {"message": "Household COO is running"}


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Check if database is working."""
    if test_connection():
        return {"status": "healthy", "database": "connected"}
    else:
        return {"status": "unhealthy", "database": "disconnected"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
