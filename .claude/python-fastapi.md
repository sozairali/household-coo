# Python / FastAPI / SQLAlchemy Rules

## File & Module Layout
- `backend/main.py` — FastAPI app setup and route registration only. No business logic.
- `backend/services/` — One file per concern. Hard limit: 200 lines. Split into sub-files if needed.
- `backend/models.py` — ORM model definitions only. Validation helpers are allowed here but keep it slim.
- `backend/database.py` — Engine and session factory only.

## Route Handlers
- Routes call service functions; they do not query the DB directly.
- All route inputs validated with Pydantic request schemas defined at the top of the route file (or a `schemas/` module if it grows).
- Return typed Pydantic response models, not raw dicts.

```python
# Good
@app.post("/api/tasks", response_model=TaskResponse)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    return task_service.create(db, payload)

# Bad — DB query inside route handler
@app.post("/api/tasks")
def create_task(payload: dict, db: Session = Depends(get_db)):
    task = Task(**payload)
    db.add(task)
    db.commit()
    return task
```

## SQLAlchemy Sessions
- Always use the `get_db` dependency via `Depends(get_db)`.
- Wrap every write in `try/except` with explicit `commit()` and `rollback()`.
- Close sessions in a `finally` block or use a context manager generator.

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Atomic Writes & Idempotency
- Use `merge()` for upserts instead of `add()` when the record may already exist.
- Generate IDs with `uuid.uuid4()` before the DB call so callers can retry safely.
- Never partially update a record across two separate commits.

## Services Layer
- Service functions take `db: Session` as first arg and a Pydantic model or plain value as data.
- Service functions must not import from `main.py` (no circular deps).
- One public function per logical operation; helper functions are private (`_`-prefixed).

## Environment & Secrets
- Load env vars at module top with `python-dotenv`: `from dotenv import load_dotenv; load_dotenv()`.
- Raise `ValueError` with a clear message if a required env var is missing.
- Never hard-code API keys, tokens, or database paths.

## Error Handling
- Raise `HTTPException` with appropriate status codes in route handlers.
- Service functions raise plain `ValueError` / `RuntimeError`; let the route handler translate.
- Always log the original exception before re-raising.

## Pydantic Schemas
- Define separate `Create`, `Update`, and `Response` schemas for each entity.
- Use `model_config = ConfigDict(from_attributes=True)` on response schemas for ORM compat.
- Validate score fields with `Field(ge=0, le=100)`, enum fields with `Literal`.

## Code Style
- Black formatting, isort imports.
- Type-annotate all function signatures.
- Avoid `Any` in type hints; use `Optional[X]` or `Union` explicitly.
- Functions under 20 lines where possible; extract helpers if longer.
