import { useAppStore } from '@/state/store';

export function BudgetPill() {
  const budget = useAppStore((state) => state.budget);

  return (
    <div className="bg-success-bg/20 border border-success-bg/40 px-4 py-2 rounded-full" data-testid="budget-pill">
      <span className="text-success-bg font-medium">
        AI Credits: <span data-testid="budget-balance">${budget.balanceUsd.toFixed(2)}</span>
      </span>
    </div>
  );
}
