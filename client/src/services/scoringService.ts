import { Task, Dimension, FeedbackItem } from '@/types';

class ScoringService {
  private storageKey = 'household-coo:feedback:v2';

  private getFeedback(): FeedbackItem[] {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse feedback from localStorage:', e);
      }
    }
    return [];
  }

  private saveFeedback(feedback: FeedbackItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(feedback));
  }

  submitFeedback(taskId: string, dimension: Dimension, signal: 1 | -1): void {
    const feedback = this.getFeedback();
    
    const newFeedback: FeedbackItem = {
      taskId,
      dimension,
      signal,
      ts: new Date().toISOString()
    };

    feedback.push(newFeedback);
    this.saveFeedback(feedback);
  }

  adjustTaskScore(task: Task, dimension: Dimension, signal: 1 | -1): Task {
    const adjustment = signal * 3; // ±3 points per feedback
    const updatedTask = { ...task };

    switch (dimension) {
      case 'importance':
        updatedTask.importance = Math.max(0, Math.min(100, task.importance + adjustment));
        break;
      case 'urgency':
        updatedTask.urgency = Math.max(0, Math.min(100, task.urgency + adjustment));
        break;
      case 'savings':
        updatedTask.savingsScore = Math.max(0, Math.min(100, task.savingsScore + adjustment));
        break;
    }

    return updatedTask;
  }

  sortTasksByDimension(tasks: Task[], dimension: Dimension): Task[] {
    return [...tasks].sort((a, b) => {
      let scoreA: number;
      let scoreB: number;

      switch (dimension) {
        case 'importance':
          scoreA = a.importance;
          scoreB = b.importance;
          break;
        case 'urgency':
          scoreA = a.urgency;
          scoreB = b.urgency;
          break;
        case 'savings':
          // Only consider tasks with actual savings
          scoreA = a.savingsUsd && a.savingsUsd > 0 ? a.savingsScore : -1;
          scoreB = b.savingsUsd && b.savingsUsd > 0 ? b.savingsScore : -1;
          break;
        default:
          return 0;
      }

      return scoreB - scoreA; // Descending order
    });
  }

  getTopTaskByDimension(tasks: Task[], dimension: Dimension): Task | undefined {
    const filtered = dimension === 'savings' 
      ? tasks.filter(task => task.savingsUsd && task.savingsUsd > 0 && task.status === 'open')
      : tasks.filter(task => task.status === 'open');
      
    const sorted = this.sortTasksByDimension(filtered, dimension);
    return sorted[0];
  }
}

export const scoringService = new ScoringService();
