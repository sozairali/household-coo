"""
Simple Email Service for Household COO

Minimal Gmail API integration for task extraction.
"""

import os
import base64
import re
from datetime import datetime, timedelta
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


def get_recent_emails(hours=24, max_results=50):
    """
    Get recent emails from Gmail.
    
    Returns:
        List of dicts with email data: {id, subject, sender, timestamp, body}
    """
    # Authenticate
    creds = _authenticate()
    if not creds:
        return []
    
    # Build service
    service = build('gmail', 'v1', credentials=creds)
    
    # Get recent emails
    since_date = (datetime.now() - timedelta(hours=hours)).strftime('%Y/%m/%d')
    query = f'after:{since_date}'
    
    try:
        results = service.users().messages().list(
            userId='me', q=query, maxResults=max_results
        ).execute()
        
        messages = results.get('messages', [])
        emails = []
        
        for msg in messages:
            email = _parse_email(service, msg['id'])
            if email:
                emails.append(email)
        
        return emails
        
    except HttpError as e:
        print(f"Error fetching emails: {e}")
        return []


def _authenticate():
    """Simple authentication - returns credentials or None"""
    SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
    creds = None
    
    # Load existing token
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    # Refresh or get new credentials
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists('credentials.json'):
                print("Missing credentials.json file")
                return None
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save token
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    
    return creds


def _parse_email(service, message_id):
    """Parse a single email - returns dict or None"""
    try:
        message = service.users().messages().get(
            userId='me', id=message_id, format='full'
        ).execute()
        
        # Extract headers
        headers = message['payload'].get('headers', [])
        subject = _get_header(headers, 'Subject') or 'No Subject'
        sender = _get_header(headers, 'From') or 'Unknown'
        date_str = _get_header(headers, 'Date') or ''
        
        # Parse body
        body = _extract_body(message['payload'])
        
        return {
            'id': message_id,
            'subject': subject,
            'sender': sender,
            'timestamp': _parse_date(date_str),
            'body': body
        }
        
    except Exception as e:
        print(f"Error parsing email {message_id}: {e}")
        return None


def _get_header(headers, name):
    """Get header value by name"""
    for header in headers:
        if header['name'].lower() == name.lower():
            return header['value']
    return None


def _parse_date(date_str):
    """Parse email date - returns datetime or now()"""
    try:
        from email.utils import parsedate_to_datetime
        return parsedate_to_datetime(date_str)
    except:
        return datetime.now()


def _extract_body(payload):
    """Extract plain text body from email payload"""
    def extract_text(part):
        if part.get('mimeType') == 'text/plain':
            data = part.get('body', {}).get('data', '')
            if data:
                return base64.urlsafe_b64decode(data).decode('utf-8', errors='ignore')
        elif part.get('mimeType') == 'text/html':
            data = part.get('body', {}).get('data', '')
            if data:
                html = base64.urlsafe_b64decode(data).decode('utf-8', errors='ignore')
                return _html_to_text(html)
        elif 'parts' in part:
            for subpart in part['parts']:
                text = extract_text(subpart)
                if text:
                    return text
        return ''
    
    return extract_text(payload)


def _html_to_text(html):
    """Simple HTML to text conversion"""
    # Remove HTML tags
    text = re.sub('<[^<]+?>', '', html)
    # Clean up whitespace
    text = ' '.join(text.split())
    return text
