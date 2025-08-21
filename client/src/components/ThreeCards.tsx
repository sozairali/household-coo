import { SpotlightCard } from './SpotlightCard';
import { useAppStore } from '@/state/store';
import { scoringService } from '@/services/scoringService';
import { Task, Dimension } from '@/types';

interface ThreeCardsProps {
  onViewList: (dimension: Dimension) => void;
  onViewInstructions: (task: Task) => void;
  onMarkComplete: (taskId: string) => void;
}

export function ThreeCards({ onViewList, onViewInstructions, onMarkComplete }: ThreeCardsProps) {
  const tasks = useAppStore((state) => state.tasks);
  
  const { importance: importantTask, urgency: urgentTask, savings: savingsTask } = scoringService.getDistinctTopTasks(tasks);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12" data-testid="three-cards">
      <SpotlightCard
        task={importantTask}
        dimension="importance"
        onViewList={onViewList}
        onViewInstructions={onViewInstructions}
        onMarkComplete={onMarkComplete}
      />
      <SpotlightCard
        task={urgentTask}
        dimension="urgency"
        onViewList={onViewList}
        onViewInstructions={onViewInstructions}
        onMarkComplete={onMarkComplete}
      />
      <SpotlightCard
        task={savingsTask}
        dimension="savings"
        onViewList={onViewList}
        onViewInstructions={onViewInstructions}
        onMarkComplete={onMarkComplete}
      />
    </div>
  );
}
