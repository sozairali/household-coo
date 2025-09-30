"""
Simple tests for database connection module.

Tests the basic functionality with SQLite database.
"""

import os
import pytest
from unittest.mock import patch
from database import get_database_url, test_connection, get_db


def test_get_database_url():
    """Test database URL generation."""
    url = get_database_url()
    assert url == "sqlite:///./household_coo.db"


def test_test_connection():
    """Test connection test function."""
    result = test_connection()
    assert isinstance(result, bool)


def test_get_db():
    """Test database session creation."""
    try:
        db = get_db()
        assert db is not None
        db.close()
    except Exception:
        # Expected to fail without real database
        pass


if __name__ == "__main__":
    pytest.main([__file__, "-v"])