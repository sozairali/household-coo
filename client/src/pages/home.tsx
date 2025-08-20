import { useState, useEffect } from 'react';
import { RefreshCw, Settings } from 'lucide-react';
import { ThreeCards } from '@/components/ThreeCards';
import { BudgetPill } from '@/components/BudgetPill';
import { TaskDrawer } from '@/components/TaskDrawer';
import { SettingsModal } from '@/components/SettingsModal';
import { useAppStore } from '@/state/store';
import { Task, Dimension } from '@/types';
import { format } from 'date-fns';
import { useLocation } from 'wouter';

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [syncStep, setSyncStep] = useState(0);

  const { 
    loadInitialData, 
    sync, 
    lastRefreshISO 
  } = useAppStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStep(0);
    
    const steps = [
      'Syncing with email...',
      'Syncing with WhatsApp...',
      'Processing messages...',
      'Done! Tasks updated'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setSyncStatus(steps[i]);
      setSyncStep(i);
      await new Promise(resolve => setTimeout(resolve, i === steps.length - 1 ? 1000 : 1500));
    }
    
    await sync();
    setIsSyncing(false);
    setSyncStatus('');
    setSyncStep(0);
  };

  const handleViewList = (dimension: Dimension) => {
    setLocation(`/list/${dimension}`);
  };

  const handleViewInstructions = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedTask(null), 300);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  };

  const formatLastRefresh = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    return format(date, 'h:mm a');
  };

  return (
    <div className="min-h-screen bg-gray-900" data-testid="page-home">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800 border-b-2 border-gray-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Integration Status Banner */}
          <div className="bg-blue-900 border border-blue-600 rounded-lg p-3 mb-4">
            <p className="text-blue-100 text-sm text-center">
              🧠 AI-powered analysis of your Gmail and WhatsApp • Finding the most urgent, important, and financially lucrative tasks
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-white" data-testid="title-app">
                Household COO
              </h1>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors min-h-[60px]"
                data-testid="button-sync"
              >
                <RefreshCw className={`text-lg w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="font-medium">{isSyncing ? syncStatus : 'Sync Now'}</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-300" data-testid="text-last-refresh">
                Last refresh: {formatLastRefresh(lastRefreshISO)}
              </div>
              
              <BudgetPill />
              
              <button
                onClick={handleOpenSettings}
                className="p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg min-h-[60px] min-w-[60px]"
                data-testid="button-settings"
                aria-label="Settings"
              >
                <Settings className="text-xl w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <ThreeCards 
          onViewList={handleViewList}
          onViewInstructions={handleViewInstructions}
        />
      </main>

      {/* Task Drawer */}
      <TaskDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onOpenSettings={handleOpenSettings}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
