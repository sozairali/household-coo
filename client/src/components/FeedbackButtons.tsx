import { ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
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
    <div className={`flex flex-col items-center ${className}`}>
      <p className="text-xs text-gray-400 mb-4">Rate the quality of this recommendation</p>
      <div className={`flex space-x-${size === 'lg' ? '8' : '2'}`}>
        <button
          onClick={() => handleFeedback(1)}
          className={`${buttonSize} text-green-400 hover:text-green-300 hover:bg-green-900 rounded-full transition-colors flex items-center justify-center`}
          data-testid="button-thumbs-up"
          aria-label="Good recommendation"
          title="Good recommendation"
        >
          <ThumbsUp className={iconSize} />
        </button>
        <button
          onClick={() => handleFeedback(-1)}
          className={`${buttonSize} text-red-400 hover:text-red-300 hover:bg-red-900 rounded-full transition-colors flex items-center justify-center`}
          data-testid="button-thumbs-down"
          aria-label="Poor recommendation"
          title="Poor recommendation"
        >
          <ThumbsDown className={iconSize} />
        </button>
      </div>
    </div>
  );
}
