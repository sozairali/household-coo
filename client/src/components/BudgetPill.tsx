import { useAppStore } from '@/state/store';

export function BudgetPill() {
  const budget = useAppStore((state) => state.budget);

  return (
    <div className="bg-green-900 border border-green-600 px-4 py-2 rounded-full" data-testid="budget-pill">
      <span className="text-green-300 font-medium">
        AI Credits: <span data-testid="budget-balance">${budget.balanceUsd.toFixed(2)}</span>
      </span>
    </div>
  );
}
