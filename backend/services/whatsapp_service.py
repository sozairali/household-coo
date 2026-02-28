"""
Simple WhatsApp Service for Household COO

Personal use WhatsApp integration - focuses on message storage.
Task extraction is handled by LLM service.
"""

import os
import json
from datetime import datetime


def verify_webhook(mode, token, challenge):
    """Verify WhatsApp webhook - required by WhatsApp"""
    verify_token = os.getenv('WHATSAPP_WEBHOOK_VERIFY_TOKEN')
    if mode == "subscribe" and token == verify_token:
        return challenge
    return None


def handle_whatsapp_message(message_data):
    """
    Handle incoming WhatsApp message - store and acknowledge.
    
    Args:
        message_data: WhatsApp message dict
        
    Returns:
        Response message or None
    """
    try:
        # Extract message info
        text = message_data.get('text', {}).get('body', '').strip()
        from_number = message_data.get('from', '')
        message_id = message_data.get('id', '')
        timestamp = message_data.get('timestamp', '')
        
        if not text or not from_number:
            return None
            
        # Store the message (in real app, save to database)
        message_record = {
            'id': message_id,
            'from_number': from_number,
            'text': text,
            'timestamp': timestamp,
            'processed': False
        }
        
        # Log the message
        print(f"Message from {from_number}: {text}")
        
        # Acknowledge receipt
        return create_response(from_number, "✅ Message received! Processing...")
        
    except Exception as e:
        print(f"Error handling WhatsApp message: {e}")
        return None


def create_response(to_number, message_text):
    """Create WhatsApp response message"""
    return {
        "to": to_number,
        "type": "text",
        "text": {"body": message_text}
    }


def handle_webhook(webhook_data):
    """
    Handle WhatsApp webhook - process all messages.
    
    Args:
        webhook_data: Raw webhook payload
        
    Returns:
        List of responses to send
    """
    responses = []
    
    try:
        # Extract messages from webhook
        for entry in webhook_data.get('entry', []):
            for change in entry.get('changes', []):
                for message in change.get('value', {}).get('messages', []):
                    response = handle_whatsapp_message(message)
                    if response:
                        responses.append(response)
    except Exception as e:
        print(f"Error processing webhook: {e}")
    
    return responses


def store_message(message_record):
    """
    Store message in database (placeholder for database integration).
    
    Args:
        message_record: Message data to store
    """
    # TODO: Integrate with database
    print(f"Storing message: {message_record}")


# Convenience function for easy integration
def process_webhook(webhook_data):
    """Process webhook with error handling"""
    try:
        return handle_webhook(webhook_data)
    except Exception as e:
        print(f"Webhook processing failed: {e}")
        return []