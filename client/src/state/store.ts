import { create } from 'zustand';
import { AppState, Task, Dimension } from '@/types';
import { persistenceService } from '@/services/persistence';
import { scoringService } from '@/services/scoringService';
import { budgetService } from '@/services/budgetService';

interface AppStore extends AppState {
  // Actions
  loadInitialData: () => Promise<void>;
  sync: () => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  submitFeedback: (taskId: string, dimension: Dimension, signal: 1 | -1) => void;
  markTaskDone: (taskId: string) => void;
  dismissTask: (taskId: string) => void;
  updateBudget: () => void;
  toggleIntegration: (integration: 'gmail' | 'whatsapp') => void;
  addFunds: (amount: number) => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
  resetDemo: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  tasks: [],
  feedback: [],
  budget: budgetService.get(),
  integrations: {
    gmailConnected: true,
    whatsappBotConnected: true,
    whatsappBotId: '+1-555-COO-HELP'
  },
  lastRefreshISO: new Date().toISOString(),

  // Actions
  loadInitialData: async () => {
    const storedState = persistenceService.load();
    
    // Load tasks from fixtures if not in stored state
    if (!storedState.tasks || storedState.tasks.length === 0) {
      const tasks = await persistenceService.loadTasks();
      storedState.tasks = tasks;
      persistenceService.save({ tasks });
    }

    set(storedState);
  },

  sync: async () => {
    // Simulate sync process
    const now = new Date().toISOString();
    
    // Shuffle timestamps slightly to simulate new data
    const tasks = get().tasks.map(task => ({
      ...task,
      receivedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    }));

    set({ 
      lastRefreshISO: now,
      tasks 
    });

    persistenceService.save({ 
      lastRefreshISO: now,
      tasks 
    });
  },

  updateTask: (taskId: string, updates: Partial<Task>) => {
    const tasks = get().tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    set({ tasks });
    persistenceService.save({ tasks });
  },

  submitFeedback: (taskId: string, dimension: Dimension, signal: 1 | -1) => {
    const { tasks } = get();
    
    // Submit feedback to scoring service
    scoringService.submitFeedback(taskId, dimension, signal);
    
    // Update task score
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return scoringService.adjustTaskScore(task, dimension, signal);
      }
      return task;
    });

    set({ tasks: updatedTasks });
    persistenceService.save({ tasks: updatedTasks });
  },

  updateBudget: () => {
    const budget = budgetService.get();
    set({ budget });
  },

  toggleIntegration: (integration: 'gmail' | 'whatsapp') => {
    const { integrations } = get();
    const field = integration === 'gmail' ? 'gmailConnected' : 'whatsappBotConnected';
    
    const updated = {
      ...integrations,
      [field]: !integrations[field]
    };

    set({ integrations: updated });
    persistenceService.save({ integrations: updated });
  },

  addFunds: (amount: number) => {
    budgetService.addFunds(amount, 'Add funds');
    const budget = budgetService.get();
    set({ budget });
  },

  exportData: () => {
    return persistenceService.exportData();
  },

  importData: (jsonData: string) => {
    persistenceService.importData(jsonData);
    const state = persistenceService.load();
    set(state);
  },

  markTaskDone: (taskId: string) => {
    get().updateTask(taskId, { status: 'done' });
  },

  dismissTask: (taskId: string) => {
    get().updateTask(taskId, { status: 'dismissed' });
  },

  resetDemo: () => {
    persistenceService.reset();
    get().loadInitialData();
  }
}));
