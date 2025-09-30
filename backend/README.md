# Household COO Backend

Simple backend for personal task management. Just connects to PostgreSQL and provides basic API endpoints.

## Quick Start

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up database**:
   - Install PostgreSQL
   - Create database: `createdb household_coo`

3. **Set environment variables** (optional):
   ```bash
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_NAME=household_coo
   export DB_USER=postgres
   export DB_PASSWORD=your_password
   ```

4. **Run the app**:
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

- `GET /` - Basic health check
- `GET /health` - Database health check

## Testing

```bash
pytest test_database.py
```

## What's Next

This simple database connection provides the foundation for:
- Task management (CRUD operations)
- Email integration (Gmail API)
- WhatsApp bot integration
- LLM service for task analysis

See `docs/backend-todo.md` for the complete roadmap.
