import { SpotlightCard } from './SpotlightCard';
import { useAppStore } from '@/state/store';
import { scoringService } from '@/services/scoringService';
import { Task, Dimension } from '@/types';

interface ThreeCardsProps {
  onViewList: (dimension: Dimension) => void;
  onViewInstructions: (task: Task) => void;
}

export function ThreeCards({ onViewList, onViewInstructions }: ThreeCardsProps) {
  const tasks = useAppStore((state) => state.tasks);
  
  const importantTask = scoringService.getTopTaskByDimension(tasks, 'importance');
  const urgentTask = scoringService.getTopTaskByDimension(tasks, 'urgency');
  const savingsTask = scoringService.getTopTaskByDimension(tasks, 'savings');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12" data-testid="three-cards">
      <SpotlightCard
        task={importantTask}
        dimension="importance"
        onViewList={onViewList}
        onViewInstructions={onViewInstructions}
      />
      <SpotlightCard
        task={urgentTask}
        dimension="urgency"
        onViewList={onViewList}
        onViewInstructions={onViewInstructions}
      />
      <SpotlightCard
        task={savingsTask}
        dimension="savings"
        onViewList={onViewList}
        onViewInstructions={onViewInstructions}
      />
    </div>
  );
}
