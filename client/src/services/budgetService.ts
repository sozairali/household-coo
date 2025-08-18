import { BudgetState, BudgetTx, TxType, InsufficientBalanceError } from '@/types';
import { nanoid } from 'nanoid';

class BudgetService {
  private storageKey = 'household-coo:budget:v2';

  get(): BudgetState {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse budget from localStorage:', e);
      }
    }

    // Default budget state
    const defaultState: BudgetState = {
      balanceUsd: 12.48,
      totalAddedUsd: 15.00,
      totalSpentUsd: 2.52,
      costPerInstructionUsd: 0.02,
      ledger: [
        {
          id: nanoid(),
          type: 'add',
          amountUsd: 15.00,
          ts: new Date().toISOString(),
          note: 'Initial setup'
        },
        {
          id: nanoid(),
          type: 'spend',
          amountUsd: 0.02,
          ts: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          note: 'Instruction: t1'
        },
        {
          id: nanoid(),
          type: 'spend',
          amountUsd: 0.02,
          ts: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          note: 'Instruction: t3'
        }
      ]
    };

    this.save(defaultState);
    return defaultState;
  }

  private save(state: BudgetState): void {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  addFunds(amountUsd: number, note?: string): BudgetState {
    const state = this.get();
    
    const transaction: BudgetTx = {
      id: nanoid(),
      type: 'add',
      amountUsd,
      ts: new Date().toISOString(),
      note: note || 'Add funds'
    };

    state.balanceUsd += amountUsd;
    state.totalAddedUsd += amountUsd;
    state.ledger.unshift(transaction);
    
    // Keep only last 10 transactions
    state.ledger = state.ledger.slice(0, 10);
    
    this.save(state);
    return state;
  }

  charge(amountUsd: number, note?: string): BudgetState {
    const state = this.get();
    
    if (state.balanceUsd < amountUsd) {
      throw new InsufficientBalanceError(`Insufficient balance. Required: $${amountUsd.toFixed(2)}, Available: $${state.balanceUsd.toFixed(2)}`);
    }

    const transaction: BudgetTx = {
      id: nanoid(),
      type: 'spend',
      amountUsd,
      ts: new Date().toISOString(),
      note: note || 'Instruction cost'
    };

    state.balanceUsd -= amountUsd;
    state.totalSpentUsd += amountUsd;
    state.ledger.unshift(transaction);
    
    // Keep only last 10 transactions
    state.ledger = state.ledger.slice(0, 10);
    
    this.save(state);
    return state;
  }

  reset(): BudgetState {
    localStorage.removeItem(this.storageKey);
    return this.get();
  }
}

export const budgetService = new BudgetService();
