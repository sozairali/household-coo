# Household COO - Architecture

## Overview

A simple task management system for busy parents. Built for both touchscreen (Raspberry Pi) and traditional web use (desktop/laptop).

## Core Architecture

```
┌─────────────────────────────────────────┐
│           Single App (Port 5000)        │
├─────────────────────────────────────────┤
│  Frontend: React + TypeScript           │
│  Backend: Python + FastAPI              │
│  Database: SQLite (local file)          │
└─────────────────────────────────────────┘
```

## Why This Stack?

| Component | Choice | Reason |
|-----------|--------|--------|
| **Frontend** | React + TypeScript | Touch-friendly, type-safe |
| **Backend** | Python + FastAPI | Excellent AI/ML ecosystem, simple API |
| **Database** | SQLite | Simple, no server setup, perfect for personal use |
| **Deployment** | Single port | Easy Raspberry Pi setup |

## Key Components

### 1. Task Engine
- Extracts tasks from Gmail emails
- Categorizes by importance, urgency, savings
- Generates step-by-step instructions

### 2. Dual-Input UI
- **Touch support**: Large buttons (44px minimum), swipe gestures
- **Web support**: Click interactions, keyboard shortcuts
- **Responsive**: Adapts to screen size automatically
- **Card-based layout**: One task at a time

### 3. Data Storage
```sql
-- SQLite tables for local storage
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    source_type TEXT NOT NULL,
    received_at TIMESTAMP NOT NULL,
    due_at TIMESTAMP,
    savings_usd REAL,
    importance INTEGER NOT NULL DEFAULT 0,
    urgency INTEGER NOT NULL DEFAULT 0,
    savings_score INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open',
    actions TEXT,  -- JSON string for action links
    citations TEXT  -- JSON string for citation links
);

CREATE TABLE budget_transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    amount_usd REAL NOT NULL,
    ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note TEXT
);

CREATE TABLE feedback (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    dimension TEXT NOT NULL,
    signal INTEGER NOT NULL,
    ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Input Methods

### Touchscreen (Raspberry Pi)
- **Large touch targets**: All buttons 44px+ 
- **Swipe gestures**: Swipe left to dismiss, right to complete
- **Voice input**: Hands-free task entry
- **High contrast**: Works in any lighting

### Web Browser (Desktop/Laptop)
- **Click interactions**: Standard mouse clicks
- **Keyboard shortcuts**: Arrow keys, Enter, Escape
- **Hover states**: Visual feedback on mouse hover
- **Tab navigation**: Full keyboard accessibility

## Deployment

```bash
# Build frontend
npm run build

# Start Python backend (serves both API and frontend)
python -m uvicorn backend.main:app --host 0.0.0.0 --port 5000

# Runs on single port (5000)
# Serves both API and frontend
```

## What's NOT Included

- Multi-user authentication (personal use only)
- Complex security (basic HTTPS is enough)
- Microservices (unnecessary complexity)
- Real-time notifications (check manually)
- Advanced analytics (simple counters only)

## Future Extensions

Each component is modular and reusable:
- Task Engine → Any task management app
- Dual-Input UI → Any multi-device app  
- Scoring System → Any prioritization tool

---

**Bottom Line**: Simple, dual-input, single-deployment app that works on both touchscreens and traditional computers.
```

