"""
Simple LLM service for Household COO personal use

Uses OpenAI API for task extraction, categorization, and instruction generation.
"""

import os
import json
from openai import OpenAI


# Initialize OpenAI client
def get_client():
    """Get OpenAI client with API key from environment"""
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key or api_key == 'your_openai_api_key':
        raise ValueError("OPENAI_API_KEY not set. Please set it in your .env file")
    return OpenAI(api_key=api_key)


def extract_tasks_from_email(email_text: str, email_subject: str = "") -> list:
    """
    Extract actionable tasks from email content.
    
    Args:
        email_text: Email body text
        email_subject: Email subject (optional)
    
    Returns:
        List of task dictionaries with title, summary, and due_date
    """
    try:
        client = get_client()
        
        prompt = f"""
You are a helpful assistant that extracts actionable tasks from emails.

Email Subject: {email_subject}
Email Body:
{email_text}

Find all actionable tasks in this email. For each task, provide:
- title: Short task title (max 100 chars)
- summary: Brief description of what needs to be done
- due_date: If a deadline is mentioned, format as YYYY-MM-DD, otherwise null

Return ONLY a JSON object with this structure:
{{"tasks": [{{"title": "...", "summary": "...", "due_date": "..." or null}}]}}

If there are no actionable tasks, return: {{"tasks": []}}
"""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            max_tokens=1000
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Track cost
        usage = response.usage
        cost = track_cost(usage.prompt_tokens, usage.completion_tokens)
        print(f"Task extraction cost: ${cost:.4f}")
        
        return result.get('tasks', [])
        
    except Exception as e:
        print(f"Error extracting tasks: {e}")
        return []


def categorize_task(task_title: str, task_summary: str = "") -> dict:
    """
    Categorize task by importance, urgency, and potential savings.
    
    Args:
        task_title: Task title
        task_summary: Task description (optional)
    
    Returns:
        Dictionary with importance, urgency, and savings scores (0-100)
    """
    try:
        client = get_client()
        
        prompt = f"""
You are a helpful assistant that categorizes household tasks.

Task: {task_title}
Details: {task_summary}

Score this task on three dimensions (0-100):
- importance: How important is this for household/family wellbeing?
- urgency: How time-sensitive is this task?
- savings: Could completing this save money or provide financial benefit?

Return ONLY a JSON object:
{{"importance": 0-100, "urgency": 0-100, "savings": 0-100}}
"""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            max_tokens=200
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Track cost
        usage = response.usage
        cost = track_cost(usage.prompt_tokens, usage.completion_tokens)
        print(f"Categorization cost: ${cost:.4f}")
        
        return {
            'importance': result.get('importance', 50),
            'urgency': result.get('urgency', 50),
            'savings': result.get('savings', 0)
        }
        
    except Exception as e:
        print(f"Error categorizing task: {e}")
        return {'importance': 50, 'urgency': 50, 'savings': 0}


def generate_instructions(task_title: str, task_summary: str = "") -> dict:
    """
    Generate step-by-step instructions for completing a task.
    
    Args:
        task_title: Task title
        task_summary: Task description (optional)
    
    Returns:
        Dictionary with steps (list) and citations (list of dicts)
    """
    try:
        client = get_client()
        
        prompt = f"""
You are a helpful assistant that creates step-by-step instructions.

Task: {task_title}
Details: {task_summary}

Create clear, actionable step-by-step instructions for completing this task.
Include helpful links or resources if relevant.

Return ONLY a JSON object:
{{
  "steps": ["Step 1: ...", "Step 2: ...", ...],
  "citations": [{{"title": "Resource name", "url": "https://..."}}]
}}

If no external resources are needed, use empty array for citations.
"""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            max_tokens=1500
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Track cost
        usage = response.usage
        cost = track_cost(usage.prompt_tokens, usage.completion_tokens)
        print(f"Instruction generation cost: ${cost:.4f}")
        
        return {
            'steps': result.get('steps', []),
            'citations': result.get('citations', [])
        }
        
    except Exception as e:
        print(f"Error generating instructions: {e}")
        return {'steps': [], 'citations': []}


def track_cost(prompt_tokens: int, completion_tokens: int) -> float:
    """
    Calculate cost for OpenAI API call.
    
    Args:
        prompt_tokens: Number of tokens in prompt
        completion_tokens: Number of tokens in completion
    
    Returns:
        Cost in USD
    """
    # GPT-4o-mini pricing (as of 2024)
    COST_PER_1K_PROMPT = 0.00015      # $0.15 per 1M tokens
    COST_PER_1K_COMPLETION = 0.0006   # $0.60 per 1M tokens
    
    prompt_cost = (prompt_tokens * COST_PER_1K_PROMPT) / 1000
    completion_cost = (completion_tokens * COST_PER_1K_COMPLETION) / 1000
    
    return prompt_cost + completion_cost

