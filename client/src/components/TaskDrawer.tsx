import { InstructionPanel } from './InstructionPanel';
import { Task } from '@/types';

interface TaskDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export function TaskDrawer({ task, isOpen, onClose, onOpenSettings }: TaskDrawerProps) {
  return (
    <InstructionPanel
      task={task}
      isOpen={isOpen}
      onClose={onClose}
      onOpenSettings={onOpenSettings}
    />
  );
}
