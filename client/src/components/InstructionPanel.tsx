import { useState } from 'react';
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

  // Load instructions when panel opens with a task
  useState(() => {
    if (isOpen && task) {
      loadInstructions(task.id);
    }
  });

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-1/2 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      data-testid="instruction-panel"
    >
      <div className="flex flex-col h-full">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Task Instructions</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg min-h-[50px] min-w-[50px]"
            data-testid="button-close-panel"
            aria-label="Close"
          >
            <X className="text-xl w-5 h-5" />
          </button>
        </div>
        
        {/* Drawer Content */}
        <div className="flex-grow p-6 overflow-y-auto">
          {/* Loading State */}
          {state === 'loading' && (
            <div className="animate-pulse space-y-4" data-testid="instruction-loading">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          )}
          
          {/* Success State */}
          {state === 'success' && data && (
            <div data-testid="instruction-success">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How to {task?.title.toLowerCase()}
              </h3>
              <ol className="space-y-3 text-gray-700 mb-6">
                {data.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              
              {task?.actions && task.actions.length > 0 && (
                <button
                  onClick={handleOpenLink}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mb-6 min-h-[60px] flex items-center"
                  data-testid="button-open-link"
                >
                  <ExternalLink className="mr-2 w-5 h-5" />
                  {task.actions[0].label}
                </button>
              )}
              
              {/* Citations */}
              {data.citations.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Citations</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {data.citations.map((citation, index) => (
                      <li key={index}>
                        <a 
                          href={citation.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
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
              <AlertTriangle className="text-red-500 text-4xl mb-4 w-16 h-16 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRetry}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors min-h-[60px] flex items-center"
                  data-testid="button-retry"
                >
                  <RotateCcw className="mr-2 w-5 h-5" />
                  Retry
                </button>
                <button
                  onClick={onOpenSettings}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors min-h-[60px]"
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
              <Wallet className="text-yellow-500 text-4xl mb-4 w-16 h-16 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Insufficient Balance</h3>
              <p className="text-gray-600 mb-6">Your AI balance is too low. Add funds in Settings.</p>
              <button
                onClick={onOpenSettings}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors min-h-[60px]"
                data-testid="button-add-funds"
              >
                Add Funds
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
