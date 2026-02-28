# Household COO — Claude Instructions

## What This Project Is
AI-powered household task manager for busy parents. Scans Gmail + WhatsApp, surfaces the top important/urgent/savings task via three spotlight cards, and generates step-by-step instructions using an LLM. Designed for Raspberry Pi kiosk and web use.

## Stack
| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind + Zustand + Wouter |
| Backend | Python + FastAPI + SQLAlchemy |
| Database | SQLite (`backend/household_coo.db`) |
| LLM | OpenAI `gpt-4o-mini` |
| Integrations | Gmail API (OAuth2), WhatsApp Business API |

## Key Directories
```
backend/
  main.py              # FastAPI app entry point
  database.py          # SQLAlchemy engine + session
  models.py            # ORM models (Task, BudgetTransaction, Feedback)
  services/
    email_service.py   # Gmail OAuth2 + email parsing
    whatsapp_service.py# WhatsApp webhook handler
    llm_service.py     # OpenAI task extraction + categorisation
client/src/
  types.ts             # Shared TypeScript types (Task, BudgetState, etc.)
  state/store.ts       # Zustand global store
  services/            # Frontend service layer
  components/          # UI components (SpotlightCard, TaskDrawer, etc.)
  pages/               # Route-level components
docs/                  # PRD, architecture, backend-todo
```

## Non-Negotiable Engineering Rules

### File Size
- **Hard limit: 200 lines per file.** Split before you reach it.
- If a file needs splitting, create a focused sibling (e.g. `email_service.py` → `email_auth.py` + `email_parser.py`).

### PR / Commit Discipline
- One concern per PR. Max ~400 lines changed per PR.
- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.
- Every PR that changes behaviour **must** include or update tests.

### Separation of Concerns
- **Backend**: routes (`main.py`) → services (`services/`) → ORM (`models.py`). No DB queries in route handlers.
- **Frontend**: pages → components → services → store. No fetch calls inside components.

### Idempotency
- All write operations (DB inserts, file saves) must be safe to retry. Use upsert semantics or check-then-write.
- `Base.metadata.create_all()` is idempotent — keep it on startup.

### Atomic Writes
- Use SQLAlchemy sessions with explicit `commit()`/`rollback()` in a `try/except`.
- Frontend `localStorage` writes: always write the full serialised object, never patch keys individually.

### Testing
- Three tests per module minimum: happy path, error/exception, edge case.
- No live network calls in unit tests. Mock Gmail, OpenAI, WhatsApp.
- See `.claude/testing.md` for conventions.

### Security
- Never commit secrets. Use `.env` (gitignored); document keys in `config.env.example`.
- `credentials.json` and `token.json` must remain gitignored.
- Validate all external inputs with **Pydantic** (Python) or **Zod** (TypeScript).

## Import Rules by Language
- **Python**: `from services.email_service import get_recent_emails` (absolute from `backend/`)
- **TypeScript**: `import { Task } from '@/types'` (alias configured in `vite.config.ts`)

## Do Not
- Do not add enterprise patterns (abstract classes, DI containers, event buses) — personal use app.
- Do not use Bazel.
- Do not commit `.db` files, `token.json`, or `credentials.json`.
- Do not rename files with `-v2`, `-refactored`, `-improved` suffixes.
- Do not create one-time utility scripts in `backend/` or `client/`.

## Detailed Rule Files
- `.claude/python-fastapi.md` — Python/FastAPI/SQLAlchemy patterns
- `.claude/testing.md` — Testing conventions and fixtures
- `.claude/frontend.md` — React/TypeScript/Tailwind conventions
- `.claude/design.md` — UI/UX and design system rules
