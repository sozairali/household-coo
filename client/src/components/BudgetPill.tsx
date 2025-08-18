import { useAppStore } from '@/state/store';

export function BudgetPill() {
  const budget = useAppStore((state) => state.budget);

  return (
    <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-full" data-testid="budget-pill">
      <span className="text-green-700 font-medium">
        Balance: <span data-testid="budget-balance">${budget.balanceUsd.toFixed(2)}</span>
      </span>
    </div>
  );
}
