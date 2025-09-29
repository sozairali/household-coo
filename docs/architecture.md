# Household COO - Architecture

## Overview

A simple task management system for busy parents. Built for both touchscreen (Raspberry Pi) and traditional web use (desktop/laptop).

## Core Architecture

```markdown:docs/architecture.md
```
┌─────────────────────────────────────────┐
│           Single App (Port 5000)        │
├─────────────────────────────────────────┤
│  Frontend: React + TypeScript           │
│  Backend: Node.js + Express             │
│  Database: PostgreSQL                   │
└─────────────────────────────────────────┘
```

## Why This Stack?

| Component | Choice | Reason |
|-----------|--------|--------|
| **Frontend** | React + TypeScript | Touch-friendly, type-safe |
| **Backend** | Node.js + Express | Same language, simple |
| **Database** | PostgreSQL | Reliable, handles JSON |
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
-- Only 3 tables needed
tasks (id, title, importance, urgency, savings, status)
budget_transactions (id, type, amount, note)
feedback (id, task_id, dimension, signal)
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
# Build and run
npm run build
npm start

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

