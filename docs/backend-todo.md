# Backend Development To-Do

## Overview
Build the essential backend modules for Household COO.

---

## Core Backend Modules (Build Order)

### 1. Database Module ✅ (EXISTING)
**File**: `shared/schema.ts`  
**Purpose**: Define data models and database schema  
**Why needed**: Core data storage for tasks, budget, and feedback  
**Status**: ✅ Complete - Schema already defined  
**Dependencies**: None

### 2. Database Connection Module
**File**: `server/database.ts`  
**Purpose**: Establish PostgreSQL connection using Drizzle ORM  
**Why needed**: Required for all data operations  
**Dependencies**: Database Module (schema)  
**Tasks**:
- [ ] Set up database connection
- [ ] Configure connection pooling
- [ ] Add connection error handling
- [ ] Test database connectivity

### 3. Email Service Module
**File**: `server/services/emailService.ts`  
**Purpose**: Gmail API integration  
**Why needed**: Feature 1 - Generate tasks from emails  
**Dependencies**: None (external API only)  
**Tasks**:
- [ ] Gmail API authentication (OAuth2)
- [ ] Fetch recent emails (last 24-48 hours)
- [ ] Parse email content (extract subject, body, sender, timestamp)
- [ ] Clean HTML formatting and extract plain text
- [ ] Handle API errors

### 4. WhatsApp Service Module
**File**: `server/services/whatsappService.ts`  
**Purpose**: WhatsApp bot integration  
**Why needed**: Feature 3 - Add tasks via WhatsApp  
**Dependencies**: None (external API only)  
**Tasks**:
- [ ] WhatsApp webhook endpoint
- [ ] Message parsing and validation
- [ ] Response formatting
- [ ] Error handling

### 5. LLM Service Module
**File**: `server/services/llmService.ts`  
**Purpose**: AI-powered task analysis  
**Why needed**: Features 2, 4, 7 - Categorize tasks and generate instructions  
**Dependencies**: None (external API only)  
**Tasks**:
- [ ] Task categorization (importance/urgency/savings)
- [ ] Instruction generation for tasks
- [ ] API cost tracking
- [ ] Error handling and retries

### 6. Budget Management Module
**File**: `server/services/budgetService.ts`  
**Purpose**: Track LLM API usage and costs  
**Why needed**: Features 9, 10 - Credit management  
**Dependencies**: Database Connection Module, LLM Service Module  
**Tasks**:
- [ ] Track API usage costs
- [ ] Add funds to budget
- [ ] Check available balance
- [ ] Prevent overspending

### 7. Task Management Module
**File**: `server/services/taskService.ts`  
**Purpose**: CRUD operations for tasks  
**Why needed**: Core functionality - manage task lifecycle  
**Dependencies**: Database Connection Module, Budget Management Module, LLM Service Module  
**Tasks**:
- [ ] Create task (from email/WhatsApp)
- [ ] Read tasks (with filtering by status)
- [ ] Update task (mark done/dismissed)
- [ ] Get top task by dimension (importance/urgency/savings)

### 8. Task Engine Module
**File**: `server/services/taskEngine.ts`  
**Purpose**: Extract and categorize tasks from emails  
**Why needed**: Architecture component - Task Engine  
**Dependencies**: Task Management Module, LLM Service Module, Email Service Module  
**Tasks**:
- [ ] Extract tasks from Gmail emails
- [ ] Categorize by importance, urgency, savings
- [ ] Generate step-by-step instructions
- [ ] Store categorized tasks

### 9. API Routes Module
**File**: `server/routes.ts` (EXISTING - needs expansion)  
**Purpose**: HTTP endpoints for frontend communication  
**Why needed**: Frontend-backend communication  
**Dependencies**: All service modules  
**Tasks**:
- [ ] Task CRUD endpoints
- [ ] Budget management endpoints
- [ ] Feedback submission endpoints
- [ ] Health check endpoint
- [ ] Error handling middleware

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
