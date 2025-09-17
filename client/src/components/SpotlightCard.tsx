import { Star, AlertTriangle, PiggyBank, Clock, DollarSign, Mail, MessageSquare, Check, List, HelpCircle } from 'lucide-react';
import { Task, Dimension } from '@/types';
import { DismissButton } from './FeedbackButtons';
import { format } from 'date-fns';

interface SpotlightCardProps {
  task: Task | undefined;
  dimension: Dimension;
  onViewList: (dimension: Dimension) => void;
  onViewInstructions: (task: Task) => void;
  onMarkComplete: (taskId: string) => void;
}

const iconMap = {
  importance: Star,
  urgency: AlertTriangle,
  savings: PiggyBank
};

const colorMap = {
  importance: 'bg-blue-600 text-white',
  urgency: 'bg-yellow-500 text-white', 
  savings: 'bg-green-600 text-white'
};

const labelMap = {
  importance: 'PRIORITY',
  urgency: 'URGENT',
  savings: 'SAVINGS'
};

const descriptionMap = {
  importance: 'Tasks that impact your family\'s wellbeing',
  urgency: 'Time-sensitive items with deadlines',
  savings: 'Money-saving opportunities and credits'
};

export function SpotlightCard({ task, dimension, onViewList, onViewInstructions, onMarkComplete }: SpotlightCardProps) {
  const Icon = iconMap[dimension];
  const colorClass = colorMap[dimension];
  const label = labelMap[dimension];
  const description = descriptionMap[dimension];

  const formatDueDate = (dueAt: string) => {
    const date = new Date(dueAt);
    const now = new Date();
    const isOverdue = date < now;
    
    return {
      text: format(date, 'EEE h:mm a').replace(' ', ' '),
      isOverdue
    };
  };

  if (!task) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-500 p-8 flex flex-col min-h-[420px]" data-testid={`card-${dimension}`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className={`p-3 rounded-full ${colorClass} mb-2`}>
              <Icon className="text-2xl w-6 h-6" />
            </div>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </div>
        
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-400 text-xl">No {dimension} tasks</p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => onViewList(dimension)}
            className="text-sm text-blue-400 hover:text-blue-300 bg-blue-900 hover:bg-blue-800 px-3 py-2 rounded-lg transition-colors"
            data-testid="button-view-list"
          >
            View List
          </button>
        </div>
      </div>
    );
  }

  const dueDate = task.dueAt ? formatDueDate(task.dueAt) : null;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-500 p-8 flex flex-col min-h-[420px]" data-testid={`card-${dimension}`}>
      {/* Category Icon and Description (top left) */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className={`p-3 rounded-full ${colorClass} mb-2`}>
            <Icon className="text-2xl w-6 h-6" />
          </div>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      
      {/* Task Title - Extra Large */}
      <h2 className="text-5xl font-bold text-white leading-tight mb-4 flex-grow" data-testid="task-title">
        {task.title}
      </h2>
      
      {/* Task Details */}
      <div className="space-y-2 mb-6">
        {/* Source Badge */}
        <div className="flex items-center space-x-2">
          {task.sourceType === 'gmail' ? (
            <Mail className="text-blue-400 text-xs w-3 h-3" />
          ) : (
            <MessageSquare className="text-green-400 text-xs w-3 h-3" />
          )}
          <span className="text-xs text-gray-400" data-testid="task-source">
            From {task.sourceType === 'gmail' ? 'Email' : 'WhatsApp'}
          </span>
        </div>
        
        {dueDate && (
          <div className="flex items-center space-x-2">
            <Clock className={`text-xs w-3 h-3 ${dueDate.isOverdue ? 'text-red-400' : 'text-gray-400'}`} />
            <span className={`text-xs ${dueDate.isOverdue ? 'text-red-400' : 'text-gray-400'}`} data-testid="task-due-date">
              Due {dueDate.text}
            </span>
          </div>
        )}
        
        {task.savingsUsd && task.savingsUsd > 0 && (
          <div className="flex items-center space-x-2">
            <DollarSign className="text-green-400 text-xs w-3 h-3" />
            <span className="text-xs text-green-400" data-testid="task-savings">
              Save ${task.savingsUsd}
            </span>
          </div>
        )}
      </div>
      
      {/* Action Buttons (moved to center) */}
      <div className="flex justify-between items-center mb-6">
        {/* Mark Complete (bottom left as clickable text with checkmark) */}
        <button
          onClick={() => onMarkComplete(task.id)}
          className="flex items-center space-x-2 text-sm text-green-400 hover:text-green-300 underline transition-colors"
          data-testid="button-mark-complete"
        >
          <Check className="w-4 h-4" />
          <span>Mark Complete</span>
        </button>
        
        {/* Other buttons (right side) */}
        <div className="flex space-x-3">
          <button
            onClick={() => onViewList(dimension)}
            className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-900 hover:bg-blue-800 px-2 py-1 rounded transition-colors"
            data-testid="button-view-list"
          >
            <List className="w-3 h-3" />
            <span>View List</span>
          </button>
          <button
            onClick={() => onViewInstructions(task)}
            className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-900 hover:bg-blue-800 px-2 py-1 rounded transition-colors"
            data-testid="button-view-instructions"
          >
            <HelpCircle className="w-3 h-3" />
            <span>View Instructions</span>
          </button>
        </div>
      </div>
      
      {/* Dismiss Button (moved to bottom) */}
      <div className="flex justify-center">
        <DismissButton taskId={task.id} dimension={dimension} />
      </div>
    </div>
  );
}
