# WhatsApp Service - Simple Version

Personal use WhatsApp integration for Household COO.

## What it does

- Receives WhatsApp messages
- Detects task messages (like "add task: call dentist")
- Sends confirmation back

## Usage

```python
from services.whatsapp_service import verify_webhook, process_webhook

# Verify webhook (required by WhatsApp)
result = verify_webhook(mode, token, challenge)

# Process incoming messages
responses = process_webhook(webhook_data)
```

## Environment Variables

- `WHATSAPP_WEBHOOK_VERIFY_TOKEN` - Token for webhook verification

## That's it!

No classes, no enums, no over-engineering. Just simple functions that work.