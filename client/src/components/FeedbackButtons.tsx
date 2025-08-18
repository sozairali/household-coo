import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Dimension } from '@/types';
import { useAppStore } from '@/state/store';

interface FeedbackButtonsProps {
  taskId: string;
  dimension: Dimension;
  size?: 'sm' | 'lg';
  className?: string;
}

export function FeedbackButtons({ taskId, dimension, size = 'lg', className = '' }: FeedbackButtonsProps) {
  const submitFeedback = useAppStore((state) => state.submitFeedback);

  const handleFeedback = (signal: 1 | -1) => {
    submitFeedback(taskId, dimension, signal);
  };

  const iconSize = size === 'lg' ? 'text-3xl' : 'text-lg';
  const buttonSize = size === 'lg' ? 'min-h-[80px] min-w-[80px] p-4' : 'min-h-[50px] min-w-[50px] p-2';

  return (
    <div className={`flex space-x-${size === 'lg' ? '8' : '2'} ${className}`}>
      <button
        onClick={() => handleFeedback(1)}
        className={`${buttonSize} text-green-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors`}
        data-testid="button-thumbs-up"
        aria-label="Thumbs up"
      >
        <ThumbsUp className={iconSize} />
      </button>
      <button
        onClick={() => handleFeedback(-1)}
        className={`${buttonSize} text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors`}
        data-testid="button-thumbs-down"
        aria-label="Thumbs down"
      >
        <ThumbsDown className={iconSize} />
      </button>
    </div>
  );
}
