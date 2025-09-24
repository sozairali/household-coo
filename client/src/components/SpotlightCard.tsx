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

const cardClassMap = {
  importance: 'card-importance',
  urgency: 'card-urgency',
  savings: 'card-savings'
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

// Icon colors without backgrounds - just the icon color
const iconColorMap = {
  importance: 'text-primary',
  urgency: 'text-chart-3', 
  savings: 'text-chart-2'
};

export function SpotlightCard({ task, dimension, onViewList, onViewInstructions, onMarkComplete }: SpotlightCardProps) {
  const Icon = iconMap[dimension];
  const iconColor = iconColorMap[dimension];
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
      <div className={`${cardClassMap[dimension]} rounded-2xl shadow-lg p-6 flex flex-col min-h-[450px]`} data-testid={`card-${dimension}`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="mb-2">
              <Icon className={`text-3xl w-8 h-8 ${iconColor}`} />
            </div>
            <p className="text-xs task-description">{description}</p>
          </div>
        </div>
        
        <div className="flex-grow flex items-center justify-center">
          <p className="task-meta-text text-xl font-medium">No {dimension} tasks</p>
        </div>
        
        <div className="flex-shrink-0 pt-4">
          <button
            onClick={() => onViewList(dimension)}
            className="flex items-center justify-center space-x-2 btn-secondary rounded-lg transition-all duration-200 text-sm font-medium h-10 w-full"
            data-testid="button-view-list"
          >
            <List className="w-4 h-4" />
            <span>View List</span>
          </button>
        </div>
      </div>
    );
  }

  const dueDate = task.dueAt ? formatDueDate(task.dueAt) : null;

  return (
    <div className={`${cardClassMap[dimension]} rounded-2xl shadow-lg p-6 flex flex-col min-h-[450px]`} data-testid={`card-${dimension}`}>
      {/* Category Icon and Description (top left) */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="mb-2">
            <Icon className={`text-3xl w-8 h-8 ${iconColor}`} />
          </div>
          <p className="text-xs task-description">{description}</p>
        </div>
      </div>
      
      {/* Task Title - Extra Large */}
      <h2 className="text-5xl font-bold text-foreground leading-tight mb-4 flex-grow-0" data-testid="task-title" style={{lineHeight: '1.1', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>
        {task.title}
      </h2>
      
      {/* Task Details */}
      <div className="space-y-2 mb-6 flex-shrink-0">
        {/* Source Badge */}
        <div className="flex items-center space-x-2">
          {task.sourceType === 'gmail' ? (
            <Mail className="text-chart-1 text-xs w-3 h-3" />
          ) : (
            <MessageSquare className="text-chart-2 text-xs w-3 h-3" />
          )}
          <span className="text-xs task-meta-text" data-testid="task-source">
            From {task.sourceType === 'gmail' ? 'Email' : 'WhatsApp'}
          </span>
        </div>
        
        {dueDate && (
          <div className="flex items-center space-x-2">
            <Clock className={`text-xs w-3 h-3 ${dueDate.isOverdue ? 'text-destructive' : 'text-muted-foreground'}`} />
            <span className={`text-xs ${dueDate.isOverdue ? 'text-destructive' : 'task-meta-text'}`} data-testid="task-due-date">
              Due {dueDate.text}
            </span>
          </div>
        )}
        
        {task.savingsUsd && task.savingsUsd > 0 && (
          <div className="flex items-center space-x-2">
            <DollarSign className="text-chart-2 text-xs w-3 h-3" />
            <span className="text-xs text-chart-2 font-medium" data-testid="task-savings">
              Save ${task.savingsUsd}
            </span>
          </div>
        )}
      </div>
      
      {/* Spacer to push buttons to bottom */}
      <div className="flex-grow"></div>
      
      {/* Action Buttons Section */}
      <div className="flex-shrink-0 space-y-4">
        {/* Primary and Secondary Actions */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => onMarkComplete(task.id)}
            className="flex items-center justify-center space-x-2 btn-primary rounded-lg transition-all duration-200 text-sm font-medium h-12 w-full"
            data-testid="button-mark-complete"
          >
            <Check className="w-4 h-4" />
            <span>Mark Complete</span>
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onViewList(dimension)}
              className="flex items-center justify-center space-x-2 btn-secondary rounded-lg transition-all duration-200 text-sm font-medium h-10 flex-1"
              data-testid="button-view-list"
            >
              <List className="w-4 h-4" />
              <span>View List</span>
            </button>
            <button
              onClick={() => onViewInstructions(task)}
              className="flex items-center justify-center space-x-2 btn-secondary rounded-lg transition-all duration-200 text-sm font-medium h-10 flex-1"
              data-testid="button-view-instructions"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Instructions</span>
            </button>
          </div>
        </div>
        
        {/* Dismiss Button - Reduced height and moved up */}
        <div className="flex justify-center pt-2">
          <DismissButton taskId={task.id} dimension={dimension} className="h-8" />
        </div>
      </div>
    </div>
  );
}
