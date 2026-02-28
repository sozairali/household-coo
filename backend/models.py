"""
Simplified SQLite database models for Household COO personal use

Hybrid approach: Keep essential models and helpers, remove complex validation.
"""

from sqlalchemy import Column, String, Integer, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import json
from typing import List, Dict

Base = declarative_base()


class Task(Base):
    """Task model for storing household tasks"""
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True)
    title = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    source_type = Column(String, nullable=False)  # 'gmail' or 'whatsapp'
    received_at = Column(DateTime, nullable=False, default=func.now())
    due_at = Column(DateTime, nullable=True)
    savings_usd = Column(Float, nullable=True)
    importance = Column(Integer, nullable=False, default=0)  # 0-100
    urgency = Column(Integer, nullable=False, default=0)     # 0-100
    savings_score = Column(Integer, nullable=False, default=0)  # 0-100
    status = Column(String, nullable=False, default='open')  # 'open', 'done', 'dismissed'
    actions = Column(Text, nullable=True)  # JSON string for action links
    citations = Column(Text, nullable=True)  # JSON string for citation links
    
    def set_actions(self, actions: List[Dict[str, str]]):
        """Set actions as JSON string"""
        self.actions = json.dumps(actions) if actions else None
    
    def get_actions(self) -> List[Dict[str, str]]:
        """Get actions as list of dicts"""
        if not self.actions:
            return []
        try:
            return json.loads(self.actions)
        except (json.JSONDecodeError, TypeError):
            return []
    
    def set_citations(self, citations: List[Dict[str, str]]):
        """Set citations as JSON string"""
        self.citations = json.dumps(citations) if citations else None
    
    def get_citations(self) -> List[Dict[str, str]]:
        """Get citations as list of dicts"""
        if not self.citations:
            return []
        try:
            return json.loads(self.citations)
        except (json.JSONDecodeError, TypeError):
            return []
    
    def to_dict(self) -> Dict:
        """Convert task to dictionary for API responses"""
        return {
            'id': self.id,
            'title': self.title,
            'summary': self.summary,
            'sourceType': self.source_type,
            'receivedAt': self.received_at.isoformat() if self.received_at else None,
            'dueAt': self.due_at.isoformat() if self.due_at else None,
            'savingsUsd': self.savings_usd,
            'importance': self.importance,
            'urgency': self.urgency,
            'savingsScore': self.savings_score,
            'status': self.status,
            'actions': self.get_actions(),
            'citations': self.get_citations()
        }


class BudgetTransaction(Base):
    """Budget transaction model for tracking LLM API costs"""
    __tablename__ = "budget_transactions"
    
    id = Column(String, primary_key=True)
    type = Column(String, nullable=False)  # 'add' or 'spend'
    amount_usd = Column(Float, nullable=False)
    ts = Column(DateTime, nullable=False, default=func.now())
    note = Column(Text, nullable=True)
    
    def to_dict(self) -> Dict:
        """Convert transaction to dictionary for API responses"""
        return {
            'id': self.id,
            'type': self.type,
            'amountUsd': self.amount_usd,
            'ts': self.ts.isoformat(),
            'note': self.note
        }


class Feedback(Base):
    """Feedback model for user feedback on task categorization"""
    __tablename__ = "feedback"
    
    id = Column(String, primary_key=True)
    task_id = Column(String, nullable=False)
    dimension = Column(String, nullable=False)  # 'importance', 'urgency', or 'savings'
    signal = Column(Integer, nullable=False)    # 1 or -1 (thumbs up/down)
    ts = Column(DateTime, nullable=False, default=func.now())
    
    def to_dict(self) -> Dict:
        """Convert feedback to dictionary for API responses"""
        return {
            'id': self.id,
            'taskId': self.task_id,
            'dimension': self.dimension,
            'signal': self.signal,
            'ts': self.ts.isoformat()
        }


# Simple validation functions for personal use
def validate_task_data(data: Dict) -> bool:
    """Simple validation for task data"""
    required_fields = ['title', 'summary', 'source_type']
    for field in required_fields:
        if field not in data or not data[field]:
            return False
    
    # Check source_type
    if data['source_type'] not in ['gmail', 'whatsapp']:
        return False
    
    # Check status
    if 'status' in data and data['status'] not in ['open', 'done', 'dismissed']:
        return False
    
    # Check numeric ranges
    for field in ['importance', 'urgency', 'savings_score']:
        if field in data:
            value = data[field]
            if not isinstance(value, int) or value < 0 or value > 100:
                return False
    
    return True


def validate_budget_transaction(data: Dict) -> bool:
    """Simple validation for budget transaction data"""
    required_fields = ['type', 'amount_usd']
    for field in required_fields:
        if field not in data:
            return False
    
    # Check type
    if data['type'] not in ['add', 'spend']:
        return False
    
    # Check amount
    if not isinstance(data['amount_usd'], (int, float)) or data['amount_usd'] <= 0:
        return False
    
    return True


def validate_feedback_data(data: Dict) -> bool:
    """Simple validation for feedback data"""
    required_fields = ['task_id', 'dimension', 'signal']
    for field in required_fields:
        if field not in data:
            return False
    
    # Check dimension
    if data['dimension'] not in ['importance', 'urgency', 'savings']:
        return False
    
    # Check signal
    if data['signal'] not in [-1, 1]:
        return False
    
    return True

