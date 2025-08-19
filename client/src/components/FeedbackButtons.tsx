import { ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { Dimension } from '@/types';
import { useAppStore } from '@/state/store';

interface FeedbackButtonsProps {
  taskId: string;
  dimension: Dimension;
  size?: 'sm' | 'lg';
  className?: string;
  showComplete?: boolean;
}

export function FeedbackButtons({ taskId, dimension, size = 'lg', className = '', showComplete = true }: FeedbackButtonsProps) {
  const submitFeedback = useAppStore((state) => state.submitFeedback);

  const handleFeedback = (signal: 1 | -1) => {
    submitFeedback(taskId, dimension, signal);
  };

  const handleMarkComplete = () => {
    // TODO: Implement task completion logic
    console.log('Mark task complete:', taskId);
  };

  const iconSize = size === 'lg' ? 'text-3xl' : 'text-lg';
  const buttonSize = size === 'lg' ? 'min-h-[80px] min-w-[80px] p-4' : 'min-h-[50px] min-w-[50px] p-2';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`flex space-x-${size === 'lg' ? '8' : '2'} ${showComplete ? 'mb-4' : ''}`}>
        <button
          onClick={() => handleFeedback(1)}
          className={`${buttonSize} text-green-400 hover:text-green-300 hover:bg-green-900 rounded-full transition-colors`}
          data-testid="button-thumbs-up"
          aria-label="Good recommendation"
          title="Good recommendation"
        >
          <ThumbsUp className={iconSize} />
        </button>
        <button
          onClick={() => handleFeedback(-1)}
          className={`${buttonSize} text-red-400 hover:text-red-300 hover:bg-red-900 rounded-full transition-colors`}
          data-testid="button-thumbs-down"
          aria-label="Poor recommendation"
          title="Poor recommendation"
        >
          <ThumbsDown className={iconSize} />
        </button>
      </div>
      
      {showComplete && (
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">Rate the quality of this recommendation</p>
          <button
            onClick={handleMarkComplete}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            data-testid="button-mark-complete"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Complete</span>
          </button>
        </div>
      )}
    </div>
  );
}
