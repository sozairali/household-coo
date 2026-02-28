"""
Simple tests for database connection module.

Tests the basic functionality with SQLite database.
"""

import os
import pytest
from unittest.mock import patch
from database import get_db
from sqlalchemy import text


def test_get_db_returns_session():
    """Happy path: get_db returns a usable SQLAlchemy session."""
    db = get_db()
    assert db is not None
    db.close()


def test_get_db_can_query():
    """Happy path: session can execute a basic SQL query."""
    db = get_db()
    result = db.execute(text("SELECT 1")).fetchone()
    assert result is not None
    db.close()


def test_get_db_closes_cleanly():
    """Edge case: closing the session twice does not raise."""
    db = get_db()
    db.close()
    db.close()  # second close must not raise


if __name__ == "__main__":
    pytest.main([__file__, "-v"])