# Backend Development To-Do

## Overview
Build the essential backend modules for Household COO using Python + FastAPI.

---

## Core Backend Modules (Build Order)

### 1. Database Module ⚠️ (NEEDS UPDATE)
**File**: `backend/models.py` (NEW - needs creation)  
**Purpose**: Define SQLite data models using SQLAlchemy  
**Why needed**: Core data storage for tasks, budget, and feedback  
**Status**: ⚠️ Needs Update - Current schema is PostgreSQL/Drizzle, needs SQLite/SQLAlchemy  
**Dependencies**: None  
**Tasks**:
- [ ] Create SQLAlchemy models for SQLite
- [ ] Add missing fields (actions, citations) to Task model
- [ ] Create database migration system
- [ ] Add model validation and relationships

### 2. Database Connection Module ✅ (COMPLETED - SIMPLIFIED)
**File**: `backend/database.py`  
**Purpose**: Establish SQLite connection using SQLAlchemy  
**Why needed**: Required for all data operations  
**Dependencies**: Database Module (schema)  
**Status**: ✅ Complete - Simplified for personal use
**Tasks**:
- [x] Set up SQLAlchemy connection
- [x] Configure SQLite database
- [x] Create tables on import (simplified)
- [x] Basic session management
- [x] Minimal setup for personal use

### 3. Email Service Module ✅ (COMPLETED)
**File**: `backend/services/email_service.py`  
**Purpose**: Gmail API integration  
**Why needed**: Feature 1 - Retrieve and parse emails  
**Dependencies**: None (external API only)  
**Status**: ✅ Complete - Full Gmail integration with OAuth2 and email parsing  
**Tasks**:
- [x] Gmail API authentication (OAuth2)
- [x] Fetch recent emails (last 24-48 hours)
- [x] Parse email content (extract subject, body, sender, timestamp)
- [x] Clean HTML formatting and extract plain text
- [x] Handle API errors
- [x] Comprehensive test coverage (235 lines of tests)

### 4. WhatsApp Service Module ✅ (COMPLETED)
**File**: `backend/services/whatsapp_service.py`  
**Purpose**: WhatsApp bot integration  
**Why needed**: Feature 3 - Add tasks via WhatsApp  
**Dependencies**: None (external API only)  
**Status**: ✅ Complete - Full WhatsApp integration with conversation flow
**Tasks**:
- [x] WhatsApp webhook endpoint
- [x] Message parsing and validation
- [x] Response formatting
- [x] Error handling
- [x] Interactive conversation flow for task categorization
- [x] Comprehensive test suite
- [x] Documentation and usage examples

### 5. LLM Service Module ✅ (COMPLETED - SIMPLIFIED)
**File**: `backend/services/llm_service.py`  
**Purpose**: AI-powered task analysis  
**Why needed**: Features 2, 4, 7 - Categorize tasks and generate instructions  
**Dependencies**: None (external API only)  
**Status**: ✅ Complete - Simple implementation for personal use  
**Tasks**:
- [x] OpenAI API integration (using gpt-4o-mini)
- [x] Task extraction from emails
- [x] Task categorization (importance/urgency/savings)
- [x] Instruction generation for tasks
- [x] Simple API cost tracking
- [x] Basic error handling
- [x] Test coverage for core operations

### 6. Budget Management Module ❌ (MISSING - HIGH PRIORITY)
**File**: `backend/services/budget_service.py`  
**Purpose**: Track LLM API usage and costs  
**Why needed**: Features 9, 10 - Credit management  
**Dependencies**: Database Connection Module, LLM Service Module  
**Status**: ❌ Missing - Currently frontend-only, needs backend persistence  
**Tasks**:
- [ ] Create budget transaction model
- [ ] Track API usage costs
- [ ] Add funds to budget
- [ ] Check available balance
- [ ] Prevent overspending
- [ ] Sync with frontend budget state
- [ ] Add budget validation and error handling

### 7. Task Management Module ❌ (MISSING - HIGH PRIORITY)
**File**: `backend/services/task_service.py`  
**Purpose**: CRUD operations for tasks  
**Why needed**: Core functionality - manage task lifecycle  
**Dependencies**: Database Connection Module, Budget Management Module, LLM Service Module  
**Status**: ❌ Missing - Critical for core functionality  
**Tasks**:
- [ ] Create task (from email/WhatsApp)
- [ ] Read tasks (with filtering by status)
- [ ] Update task (mark done/dismissed)
- [ ] Get top task by dimension (importance/urgency/savings)
- [ ] Task validation and error handling
- [ ] Integration with frontend task state
- [ ] Task scoring and ranking logic

### 8. Task Engine Module ❌ (MISSING - HIGH PRIORITY)
**File**: `backend/services/task_engine.py`  
**Purpose**: Extract and categorize tasks from emails  
**Why needed**: Architecture component - Task Engine  
**Dependencies**: Task Management Module, LLM Service Module, Email Service Module  
**Status**: ❌ Missing - Critical for email-to-task pipeline  
**Tasks**:
- [ ] Extract tasks from Gmail emails using LLM
- [ ] Categorize by importance, urgency, savings
- [ ] Generate step-by-step instructions
- [ ] Store categorized tasks in database
- [ ] Handle email parsing errors
- [ ] Batch processing for multiple emails
- [ ] Integration with existing email service

### 9. API Routes Module ⚠️ (PARTIAL - NEEDS EXPANSION)
**File**: `backend/main.py` (EXISTING - needs expansion)  
**Purpose**: HTTP endpoints for frontend communication  
**Why needed**: Frontend-backend communication  
**Dependencies**: All service modules  
**Status**: ⚠️ Partial - Only health check endpoints exist  
**Tasks**:
- [ ] Task CRUD endpoints (GET, POST, PUT, DELETE /api/tasks)
- [ ] Budget management endpoints (GET, POST /api/budget)
- [ ] Feedback submission endpoints (POST /api/feedback)
- [ ] LLM integration endpoints (POST /api/llm/instructions)
- [ ] Email sync endpoints (POST /api/email/sync)
- [ ] WhatsApp webhook endpoints (POST /api/whatsapp/webhook)
- [ ] Error handling middleware
- [ ] Request validation with Pydantic
- [ ] API documentation with FastAPI auto-docs

---

## API Endpoints Documentation

### Core API Endpoints Required

#### Task Management
- `GET /api/tasks` - List all tasks with optional filtering
- `GET /api/tasks/{task_id}` - Get specific task details
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{task_id}` - Update task (mark done/dismissed)
- `DELETE /api/tasks/{task_id}` - Delete task
- `GET /api/tasks/top/{dimension}` - Get top task by dimension (importance/urgency/savings)

#### Budget Management
- `GET /api/budget` - Get current budget state
- `POST /api/budget/add` - Add funds to budget
- `GET /api/budget/transactions` - Get transaction history
- `GET /api/budget/balance` - Get current balance

#### LLM Integration
- `POST /api/llm/instructions/{task_id}` - Generate instructions for task
- `POST /api/llm/categorize` - Categorize task (importance/urgency/savings)
- `POST /api/llm/extract-tasks` - Extract tasks from email content

#### Email Integration
- `POST /api/email/sync` - Sync emails and extract tasks
- `GET /api/email/status` - Check email connection status
- `GET /api/email/recent` - Get recent emails (for debugging)

#### WhatsApp Integration
- `POST /api/whatsapp/webhook` - Handle incoming WhatsApp messages
- `GET /api/whatsapp/status` - Check WhatsApp bot status
- `POST /api/whatsapp/send` - Send message via WhatsApp (if needed)

#### Feedback System
- `POST /api/feedback` - Submit user feedback on task categorization
- `GET /api/feedback/{task_id}` - Get feedback for specific task

#### System Health
- `GET /` - Basic health check
- `GET /health` - Detailed system health (database, services)
- `GET /api/status` - API status and version info

---

## Build Sequence Rationale

**Foundation (1-2)**: Database schema and connection
**External Connectors (3-5)**: Email, WhatsApp, LLM (no internal dependencies)
**Internal Connectors (6-7)**: Budget and task management (depend on external connectors)
**Integration Layer (8-9)**: Task engine and API routes (depend on everything)

---

## Integration Points

### External APIs Required
- **Gmail API**: Email authentication and reading
- **WhatsApp Business API**: Bot message handling
- **OpenAI/Anthropic API**: Task analysis and instructions

### Internal Dependencies

## Python-Specific Considerations

### Dependencies
- **FastAPI**: Modern, fast web framework for APIs
- **SQLAlchemy**: Python SQL toolkit and ORM
- **Alembic**: Database migration tool
- **Pydantic**: Data validation using Python type annotations
- **httpx**: Modern HTTP client for external API calls
- **python-multipart**: For handling form data
- **python-jose**: JWT token handling
- **passlib**: Password hashing