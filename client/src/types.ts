export type Dimension = 'importance' | 'urgency' | 'savings';
export type SourceType = 'gmail' | 'whatsapp';
export type TaskStatus = 'open' | 'done' | 'dismissed';

export interface Task {
  id: string;
  title: string;
  summary: string;
  sourceType: SourceType;
  receivedAt: string;            // ISO
  dueAt?: string;                // ISO if known
  savingsUsd?: number;           // Only for Savings items; undefined for bills/expenses
  importance: number;            // 0..100 (pretend "LLM-scored")
  urgency: number;               // 0..100
  savingsScore: number;          // 0..100 (only meaningful when savingsUsd>0)
  status: TaskStatus;
  actions?: {label: string; url: string}[];
  citations?: {title: string; url: string}[]; // For Instruction panel (mocked)
}

export interface FeedbackItem {
  taskId: string;
  dimension: Dimension;
  signal: 1 | -1;                // thumbs up/down
  ts: string;                    // ISO
}

export type TxType = 'add' | 'spend';
export interface BudgetTx { 
  id: string; 
  type: TxType; 
  amountUsd: number; 
  ts: string; 
  note?: string; 
}

export interface BudgetState {
  balanceUsd: number;            // current spendable balance
  totalAddedUsd: number;         // sum of credits
  totalSpentUsd: number;         // sum of debits
  costPerInstructionUsd: number; // default 0.02
  ledger: BudgetTx[];            // most recent first
}

export interface IntegrationsState {
  gmailConnected: boolean;
  whatsappBotConnected: boolean;
  whatsappBotId: string;
}

export interface AppState {
  tasks: Task[];
  feedback: FeedbackItem[];
  budget: BudgetState;
  integrations: IntegrationsState;
  lastRefreshISO: string;
}

export class InsufficientBalanceError extends Error {
  constructor(message: string = "Insufficient balance") {
    super(message);
    this.name = "InsufficientBalanceError";
  }
}

export class ConnectionError extends Error {
  constructor(message: string = "Connection error") {
    super(message);
    this.name = "ConnectionError";
  }
}
