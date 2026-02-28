# Testing Conventions

## Guiding Principle
Every module gets a test file. Every PR that changes behaviour includes or updates tests.

---

## Python (pytest)

### File Naming
- `backend/test_<module>.py` — mirrors the module under test.
- Examples: `test_email_service.py`, `test_llm_service.py`, `test_task_service.py`.

### Minimum Three Tests Per Module
1. **Happy path** — normal inputs produce expected output.
2. **Error / exception** — external failure (API down, bad env var) is handled gracefully.
3. **Edge case** — empty input, boundary values (score=0, score=100), missing optional fields.

### Fixtures & Mocking
- Use `pytest` fixtures for shared setup (in-memory DB, dummy tasks).
- Mock all external I/O with `unittest.mock.patch`. No live network calls in unit tests.
- Use `pytest-mock` or `unittest.mock.MagicMock` for Gmail, OpenAI, and WhatsApp clients.

```python
# Example fixture
@pytest.fixture
def db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine)()
    yield session
    session.close()

# Example mock
def test_extract_tasks_api_error(mocker):
    mocker.patch("services.llm_service.get_client", side_effect=ValueError("no key"))
    result = extract_tasks_from_email("some email text")
    assert result == []
```

### Database Tests
- Use `sqlite:///:memory:` — never touch `household_coo.db` in tests.
- Call `Base.metadata.create_all(engine)` in the fixture, not in module import.

### Idempotency Tests
- For any function that writes to the DB, call it twice with the same inputs and assert the result is the same (no duplicate rows, no error).

---

## TypeScript / Frontend (Vitest)

### File Naming
- `client/src/services/__tests__/<service>.test.ts`
- `client/src/components/__tests__/<Component>.test.tsx`

### Minimum Three Tests Per Module
Same pattern: happy path, error handling, edge case.

### Mocking
- Mock `localStorage` for persistence and budget services.
- Mock `fetch` / API calls; never hit a real backend in unit tests.
- Use `vi.mock()` for module-level mocks.

```typescript
// Example
vi.mock('@/services/persistence', () => ({
  persistenceService: { load: vi.fn(() => ({ tasks: [] })), save: vi.fn() }
}));
```

### Scoring & Budget Services
- Pure functions: test with direct inputs, no mocks needed.
- Cover `InsufficientBalanceError` being thrown when balance < charge.

---

## Coverage Targets
| Area | Target |
|---|---|
| Service functions (Python) | 80 %+ line coverage |
| Route handlers | 70 %+ (via integration-style tests with `TestClient`) |
| Frontend services | 80 %+ |
| UI components | Happy path render + key interactions |

## Running Tests
```bash
# Python
cd backend && pytest -v

# Frontend (once configured)
npm run test
```
