import { AppState, Task, BudgetState, IntegrationsState } from '@/types';
import { budgetService } from './budgetService';

class PersistenceService {
  private storageKey = 'household-coo:v2';

  async loadTasks(): Promise<Task[]> {
    try {
      const response = await fetch('/fixtures/tasks.json');
      const tasks = await response.json();
      return tasks;
    } catch (error) {
      console.warn('Failed to load tasks from fixtures, using empty array:', error);
      return [];
    }
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
