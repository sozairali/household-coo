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

  getDistinctTopTasks(tasks: Task[]): { importance?: Task; urgency?: Task; savings?: Task } {
    const openTasks = tasks.filter(task => task.status === 'open');
    const savingsTasks = openTasks.filter(task => task.savingsUsd && task.savingsUsd > 0);
    
    // Get sorted lists for each dimension
    const importanceSorted = this.sortTasksByDimension(openTasks, 'importance');
    const urgencySorted = this.sortTasksByDimension(openTasks, 'urgency');
    const savingsSorted = this.sortTasksByDimension(savingsTasks, 'savings');
    
    const result: { importance?: Task; urgency?: Task; savings?: Task } = {};
    const usedTaskIds = new Set<string>();
    
    // Assign top tasks ensuring uniqueness across all three categories
    if (importanceSorted[0]) {
      result.importance = importanceSorted[0];
      usedTaskIds.add(importanceSorted[0].id);
    }
    
    // Find first urgent task that's not already used
    const urgentTask = urgencySorted.find(task => !usedTaskIds.has(task.id));
    if (urgentTask) {
      result.urgency = urgentTask;
      usedTaskIds.add(urgentTask.id);
    } else if (urgencySorted.length > 0) {
      // If all urgent tasks are used, show the top urgent anyway to ensure all cards have content
      result.urgency = urgencySorted[0];
    }
    
    // Find first savings task that's not already used
    const savingsTask = savingsSorted.find(task => !usedTaskIds.has(task.id));
    if (savingsTask) {
      result.savings = savingsTask;
    } else if (savingsSorted.length > 0) {
      // If all savings tasks are used, show the top savings anyway to ensure all cards have content
      result.savings = savingsSorted[0];
    }
    
    return result;
  }
}

export const scoringService = new ScoringService();
