import { X } from 'lucide-react';
import { Dimension } from '@/types';
import { useAppStore } from '@/state/store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DismissButtonProps {
  taskId: string;
  dimension: Dimension;
  className?: string;
}

export function DismissButton({ taskId, dimension, className = '' }: DismissButtonProps) {
  const dismissTask = useAppStore((state) => state.dismissTask);

  const handleDismiss = () => {
    dismissTask(taskId);
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            className="flex items-center justify-center space-x-2 btn-destructive touch-target rounded-lg transition-all duration-200 text-sm font-medium"
            data-testid="button-dismiss"
          >
            <X className="w-4 h-4" />
            <span>Dismiss</span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-800 border-gray-600">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Dismiss Task</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Dismiss task as not relevant? This will remove it from your task list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
              No
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDismiss}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// For backward compatibility, export as FeedbackButtons as well
export { DismissButton as FeedbackButtons };