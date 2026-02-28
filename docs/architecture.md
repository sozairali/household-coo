# Household COO — Architecture

## System Overview

Two physical machines on the same home network. The Pi is the only thing
users ever interact with. The home machine stays in the background as a
dedicated LLM server.

```
 HOME NETWORK
 ══════════════════════════════════════════════════════════════════════

  ┌─────────────────────────────────────┐     ┌──────────────────────────────┐
  │       RASPBERRY PI (Kiosk)          │     │   HOME MACHINE (LLM Server)  │
  │                                     │     │                              │
  │  ┌─────────────────────────────┐    │     │  ┌────────────────────────┐  │
  │  │   React + TypeScript        │    │     │  │   Ollama daemon        │  │
  │  │   Kiosk UI  (port 5000)     │    │     │  │                        │  │
  │  │                             │    │     │  │   llama3.1:8b          │  │
  │  │   • Three spotlight cards   │    │     │  │   (GPU-accelerated)    │  │
  │  │   • Task instructions       │    │     │  │                        │  │
  │  │   • Settings / budget       │    │     │  │   OpenAI-compatible    │  │
  │  └────────────┬────────────────┘    │     │  │   API  (port 11434)    │  │
  │               │ HTTP (same process) │     │  └────────────┬───────────┘  │
  │  ┌────────────▼────────────────┐    │     │               │              │
  │  │   FastAPI Backend           │    │     └───────────────┼──────────────┘
  │  │                             │    │                     │
  │  │   • Task CRUD               │◄───┼─────────────────────┘
  │  │   • Email sync scheduler    │    │   HTTP :11434/v1
  │  │   • WhatsApp webhook        │    │   (local network)
  │  │   • LLM client              │    │
  │  │   • Scoring & ranking       │    │
  │  └────────────┬────────────────┘    │
  │               │                     │
  │  ┌────────────▼────────────────┐    │
  │  │   SQLite                    │    │
  │  │   household_coo.db          │    │
  │  │                             │    │
  │  │   • tasks                   │    │
  │  │   • budget_transactions     │    │
  │  │   • feedback                │    │
  │  └─────────────────────────────┘    │
  │                                     │
  └─────────────────────────────────────┘
               │               │
               │  INTERNET      │
        ┌──────▼──────┐  ┌─────▼──────────┐
        │  Gmail API  │  │ WhatsApp       │
        │  (OAuth2)   │  │ Business API   │
        └─────────────┘  └────────────────┘
```

---

## Data Flow

### Daily email sync (scheduled, ~24h interval)
```
Gmail API → email_service → raw email text
         → llm_service (Ollama) → extracted tasks + scores
         → SQLite tasks table
         → React UI (three cards refresh)
```

### WhatsApp task entry (on demand)
```
User WhatsApp message → WhatsApp webhook → FastAPI
                      → llm_service (Ollama) → categorised task
                      → SQLite tasks table
                      → React UI (card updates)
```

### View instructions (on demand)
```
User taps "Instructions" → FastAPI
                         → llm_service (Ollama) → step-by-step plan
                         → Instruction drawer (React)
                         → budget_transactions updated
```

---

## Component Responsibilities

| Component | Where | Responsibility |
|---|---|---|
| React UI | Pi | Kiosk display, touch interaction, task cards |
| FastAPI | Pi | API routes, scheduling, orchestration |
| SQLite | Pi | Persistent storage for tasks, budget, feedback |
| email_service | Pi | Gmail OAuth2, fetch + parse raw emails |
| whatsapp_service | Pi | Webhook receiver, message parsing |
| llm_service | Pi (client) | Calls Ollama, prompt construction, response parsing |
| Ollama + llama3.1:8b | Home machine | Task extraction, categorisation, instruction generation |

---

## LLM Server Setup (Home Machine)

```bash
# Install Ollama (one-time)
curl -fsSL https://ollama.com/install.sh | sh   # Linux/Mac
# or download installer from ollama.com           # Windows

# Pull the model (one-time, ~4.7 GB)
ollama pull llama3.1:8b

# Allow LAN access (so the Pi can reach it)
OLLAMA_HOST=0.0.0.0 ollama serve
```

Find your home machine's local IP:
```bash
# Mac / Linux
ip route get 1 | awk '{print $7}'

# Windows
ipconfig | findstr "IPv4"
# e.g. 192.168.1.42
```

---

## Pi Configuration

Add to `backend/.env`:
```
OLLAMA_BASE_URL=http://192.168.1.42:11434/v1   # your home machine's LAN IP
OLLAMA_MODEL=llama3.1:8b
```

The `llm_service.py` client call becomes:
```python
client = OpenAI(
    base_url=os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434/v1'),
    api_key="ollama"          # required by SDK, ignored by Ollama
)
model = os.getenv('OLLAMA_MODEL', 'llama3.1:8b')
```

No other code changes needed — Ollama's API is fully OpenAI-compatible.

---

## Why This Split?

| Concern | Decision |
|---|---|
| Pi stays fast and cool | Pi never runs the model — only makes HTTP calls |
| Model quality | 8B parameter model with GPU >> 3B on Pi CPU |
| Offline resilience | Tasks and UI still work if home machine is off; only instruction generation fails |
| Simplicity | No Kubernetes, no Docker Compose — two processes, one network call |
| Cost | $0/month vs. commercial API |

---

## Stack Summary

| Layer | Tech | Location |
|---|---|---|
| UI | React + TypeScript + Tailwind + Zustand | Pi |
| API | Python + FastAPI | Pi |
| DB | SQLite | Pi |
| LLM inference | Ollama + llama3.1:8b | Home machine (GPU) |
| Email | Gmail API (OAuth2) | Internet |
| Messaging | WhatsApp Business API | Internet |
