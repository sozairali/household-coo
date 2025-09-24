import { useState, useEffect } from 'react';
import { X, ExternalLink, AlertTriangle, Wallet, RotateCcw } from 'lucide-react';
import { Task, InsufficientBalanceError, ConnectionError } from '@/types';
import { llmService } from '@/services/llmService';
import { useAppStore } from '@/state/store';

interface InstructionPanelProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

type InstructionState = 'loading' | 'success' | 'error' | 'insufficient-balance';

interface InstructionData {
  steps: string[];
  citations: { title: string; url: string }[];
}

export function InstructionPanel({ task, isOpen, onClose, onOpenSettings }: InstructionPanelProps) {
  const [state, setState] = useState<InstructionState>('loading');
  const [data, setData] = useState<InstructionData | null>(null);
  const [error, setError] = useState<string>('');
  const updateBudget = useAppStore((state) => state.updateBudget);

  const loadInstructions = async (taskId: string) => {
    setState('loading');
    setError('');
    
    try {
      const result = await llmService.getInstructions(taskId);
      setData(result);
      setState('success');
      updateBudget(); // Update budget after successful charge
    } catch (err) {
      if (err instanceof InsufficientBalanceError) {
        setState('insufficient-balance');
        setError(err.message);
      } else if (err instanceof ConnectionError) {
        setState('error');
        setError('We couldn\'t connect to the assistant. Please retry or check Settings.');
      } else {
        setState('error');
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleRetry = () => {
    if (task) {
      loadInstructions(task.id);
    }
  };

  const handleOpenLink = () => {
    if (task?.actions && task.actions.length > 0) {
      window.open(task.actions[0].url, '_blank');
    }
  };

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen) {
        const target = event.target as Element;
        const panel = document.querySelector('[data-testid="instruction-panel"]');
        if (panel && !panel.contains(target)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Load instructions when panel opens with a task
  useEffect(() => {
    if (isOpen && task) {
      loadInstructions(task.id);
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for outside clicks */}
      <div 
        className="fixed inset-0 bg-black/20 z-[60]"
        onClick={onClose}
        data-testid="instruction-backdrop"
      />
      
      {/* Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-1/2 bg-background shadow-2xl border-l border-border transform transition-transform duration-300 z-[70] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-testid="instruction-panel"
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Task Instructions</h2>
            <button
              onClick={onClose}
              className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg min-h-[50px] min-w-[50px] flex items-center justify-center border border-red-500/30"
              data-testid="button-close-panel"
              aria-label="Close"
            >
              <X className="w-6 h-6 font-bold" />
            </button>
          </div>
          
          {/* Drawer Content */}
          <div className="flex-grow p-6 overflow-y-auto">
            {/* Loading State */}
            {state === 'loading' && (
              <div className="animate-pulse space-y-4" data-testid="instruction-loading">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            )}
            
            {/* Success State */}
            {state === 'success' && data && (
              <div data-testid="instruction-success">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  How to {task?.title.toLowerCase()}
                </h3>
                <ol className="space-y-3 text-muted-foreground mb-6">
                  {data.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-chart-2/20 text-chart-2 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                
                {task?.actions && task.actions.length > 0 && (
                  <button
                    onClick={handleOpenLink}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors mb-6 min-h-[60px] flex items-center"
                    data-testid="button-open-link"
                  >
                    <ExternalLink className="mr-2 w-5 h-5" />
                    {task.actions[0].label}
                  </button>
                )}
                
                {/* Citations */}
                {data.citations.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Citations</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {data.citations.map((citation, index) => (
                        <li key={index}>
                          <a 
                            href={citation.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                            data-testid={`link-citation-${index}`}
                          >
                            {citation.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Error State */}
            {state === 'error' && (
              <div className="text-center py-12" data-testid="instruction-error">
                <AlertTriangle className="text-destructive text-4xl mb-4 w-16 h-16 mx-auto" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Connection Error</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleRetry}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors min-h-[60px] flex items-center"
                    data-testid="button-retry"
                  >
                    <RotateCcw className="mr-2 w-5 h-5" />
                    Retry
                  </button>
                  <button
                    onClick={onOpenSettings}
                    className="border border-border text-muted-foreground px-6 py-3 rounded-lg hover:bg-muted transition-colors min-h-[60px]"
                    data-testid="button-check-settings"
                  >
                    Check Settings
                  </button>
                </div>
              </div>
            )}
            
            {/* Insufficient Balance State */}
            {state === 'insufficient-balance' && (
              <div className="text-center py-12" data-testid="instruction-insufficient-balance">
                <Wallet className="text-chart-3 text-4xl mb-4 w-16 h-16 mx-auto" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Insufficient Balance</h3>
                <p className="text-muted-foreground mb-6">Your AI balance is too low. Add funds in Settings.</p>
                <button
                  onClick={onOpenSettings}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors min-h-[60px]"
                  data-testid="button-add-funds"
                >
                  Add Funds
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
