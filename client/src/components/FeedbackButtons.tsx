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
            className={`flex items-center justify-center space-x-2 btn-destructive rounded-lg transition-all duration-200 text-sm font-medium ${className.includes('h-8') ? 'h-8 min-h-[32px] px-3' : 'touch-target'}`}
            data-testid="button-dismiss"
          >
            <X className="w-4 h-4" />
            <span>Dismiss</span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Dismiss Task</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Dismiss task as not relevant? This will remove it from your task list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted text-foreground border-border hover:bg-muted/80">
              No
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDismiss}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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