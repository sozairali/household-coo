import { Clock, DollarSign, Mail, MessageSquare, CheckCircle, X } from 'lucide-react';
import { Task, Dimension } from '@/types';
import { FeedbackButtons } from './FeedbackButtons';
import { format } from 'date-fns';

interface TaskRowProps {
  task: Task;
  dimension: Dimension;
  onViewInstructions: (task: Task) => void;
  onMarkDone: (taskId: string) => void;
  onDismiss: (taskId: string) => void;
}

export function TaskRow({ task, dimension, onViewInstructions, onMarkDone, onDismiss }: TaskRowProps) {
  const formatDueDate = (dueAt: string) => {
    const date = new Date(dueAt);
    const now = new Date();
    const isOverdue = date < now;
    
    return {
      text: format(date, 'EEE h:mm a').replace(' ', ' '),
      isOverdue
    };
  };

  const dueDate = task.dueAt ? formatDueDate(task.dueAt) : null;

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors" data-testid={`row-task-${task.id}`}>
      <div className="flex items-start justify-between">
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid="task-title">
            {task.title}
          </h3>
          <p className="text-gray-600 mb-3" data-testid="task-summary">
            {task.summary}
          </p>
          
          {/* Task Chips */}
          <div className="flex items-center space-x-3">
            {dueDate && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                dueDate.isOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`} data-testid="chip-due-date">
                Due {dueDate.text}
              </span>
            )}
            
            {task.savingsUsd && task.savingsUsd > 0 && (
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full flex items-center" data-testid="chip-savings">
                <DollarSign className="w-3 h-3 mr-1" />
                Save ${task.savingsUsd}
              </span>
            )}
            
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full flex items-center" data-testid="chip-source">
              {task.sourceType === 'gmail' ? (
                <Mail className="w-3 h-3 mr-1" />
              ) : (
                <MessageSquare className="w-3 h-3 mr-1" />
              )}
              {task.sourceType === 'gmail' ? 'Gmail' : 'WhatsApp'}
            </span>

            {task.status !== 'open' && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                task.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`} data-testid="chip-status">
                {task.status === 'done' ? 'Done' : 'Dismissed'}
              </span>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3 ml-6">
          <button
            onClick={() => onViewInstructions(task)}
            className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors min-h-[50px]"
            data-testid="button-how-to"
          >
            How-to
          </button>
          
          {task.status === 'open' && (
            <>
              <button
                onClick={() => onMarkDone(task.id)}
                className="text-sm text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors min-h-[50px] flex items-center"
                data-testid="button-mark-done"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark Done
              </button>
              <button
                onClick={() => onDismiss(task.id)}
                className="text-sm text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors min-h-[50px] flex items-center"
                data-testid="button-dismiss"
              >
                <X className="w-4 h-4 mr-1" />
                Dismiss
              </button>
            </>
          )}
          
          {/* Feedback Buttons */}
          <FeedbackButtons taskId={task.id} dimension={dimension} size="sm" className="ml-4" />
        </div>
      </div>
    </div>
  );
}
