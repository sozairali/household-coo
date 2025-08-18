import { AppState, Task, BudgetState, IntegrationsState } from '@/types';
import { budgetService } from './budgetService';

class PersistenceService {
  private storageKey = 'household-coo:v2';

  async loadTasks(): Promise<Task[]> {
    // Since we can't load from fixtures in this environment, return mock tasks directly
    const mockTasks: Task[] = [
      {
        "id": "t1",
        "title": "Pay preschool deposit",
        "summary": "Email from Sunshine Preschool. Deposit due Aug 25.",
        "sourceType": "gmail",
        "receivedAt": "2025-08-18T08:10:00-04:00",
        "dueAt": "2025-08-25T17:00:00-04:00",
        "importance": 92,
        "urgency": 78,
        "savingsScore": 0,
        "status": "open",
        "actions": [{"label": "Open email", "url": "https://mail.google.com/"}]
      },
      {
        "id": "t2",
        "title": "Use $150 airline credit (expires Friday)",
        "summary": "AmAir credit on file from June flight. Use toward fall trip.",
        "sourceType": "gmail",
        "receivedAt": "2025-08-17T15:02:00-04:00",
        "dueAt": "2025-08-22T23:59:00-04:00",
        "savingsUsd": 150,
        "importance": 70,
        "urgency": 65,
        "savingsScore": 88,
        "status": "open",
        "actions": [{"label": "Manage credit", "url": "https://example-airline.com"}],
        "citations": [{"title": "Carrier credit policy", "url": "https://example-airline.com/policy"}]
      },
      {
        "id": "t3",
        "title": "Immunization records upload",
        "summary": "WhatsApp: 'School needs vax records by Wed'",
        "sourceType": "whatsapp",
        "receivedAt": "2025-08-18T07:00:00-04:00",
        "dueAt": "2025-08-20T17:00:00-04:00",
        "importance": 95,
        "urgency": 85,
        "savingsScore": 0,
        "status": "open",
        "actions": [{"label": "School portal", "url": "https://school.example/portal"}]
      },
      {
        "id": "t4",
        "title": "Claim $75 pharmacy cashback",
        "summary": "CVS ExtraCare rewards ready to redeem.",
        "sourceType": "gmail",
        "receivedAt": "2025-08-16T14:30:00-04:00",
        "dueAt": "2025-08-30T23:59:00-04:00",
        "savingsUsd": 75,
        "importance": 45,
        "urgency": 35,
        "savingsScore": 72,
        "status": "open",
        "actions": [{"label": "CVS account", "url": "https://cvs.com/account"}]
      },
      {
        "id": "t5",
        "title": "Schedule annual checkup",
        "summary": "Reminder from Dr. Smith's office for yearly physical.",
        "sourceType": "gmail",
        "receivedAt": "2025-08-15T09:20:00-04:00",
        "importance": 75,
        "urgency": 40,
        "savingsScore": 0,
        "status": "open",
        "actions": [{"label": "Patient portal", "url": "https://mychart.example.com"}]
      }
    ];
    
    return mockTasks;
  }

  save(state: Partial<AppState>): void {
    const current = this.load();
    const updated = { ...current, ...state };
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  load(): AppState {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse app state from localStorage:', e);
      }
    }

    // Default state
    return {
      tasks: [],
      feedback: [],
      budget: budgetService.get(),
      integrations: {
        gmailConnected: true,
        whatsappBotConnected: true,
        whatsappBotId: '+1-555-COO-HELP'
      },
      lastRefreshISO: new Date().toISOString()
    };
  }

  exportData(): string {
    const state = this.load();
    return JSON.stringify(state, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const state = JSON.parse(jsonData);
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (error) {
      throw new Error('Invalid JSON data');
    }
  }

  reset(): void {
    localStorage.removeItem(this.storageKey);
    budgetService.reset();
  }
}

export const persistenceService = new PersistenceService();
