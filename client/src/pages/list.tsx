import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { TaskRow } from '@/components/TaskRow';
import { TaskDrawer } from '@/components/TaskDrawer';
import { SettingsModal } from '@/components/SettingsModal';
import { useAppStore } from '@/state/store';
import { scoringService } from '@/services/scoringService';
import { Task, Dimension, TaskStatus } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ListPage() {
  const [location, setLocation] = useLocation();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('open');
  const [dateFilter, setDateFilter] = useState<'all' | '7days'>('all');

  const { tasks, updateTask } = useAppStore();

  // Extract dimension from URL
  const dimension = location.split('/')[2] as Dimension;

  // Validate dimension
  useEffect(() => {
    if (!['importance', 'urgency', 'savings'].includes(dimension)) {
      setLocation('/');
    }
  }, [dimension, setLocation]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by dimension (savings only shows tasks with savings)
    if (dimension === 'savings') {
      filtered = filtered.filter(task => task.savingsUsd && task.savingsUsd > 0);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filter by date
    if (dateFilter === '7days') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(task => new Date(task.receivedAt) >= weekAgo);
    }

    // Sort by dimension
    return scoringService.sortTasksByDimension(filtered, dimension);
  }, [tasks, dimension, statusFilter, dateFilter]);

  const handleViewInstructions = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const handleMarkDone = (taskId: string) => {
    updateTask(taskId, { status: 'done' });
  };

  const handleDismiss = (taskId: string) => {
    updateTask(taskId, { status: 'dismissed' });
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

  const dimensionLabels = {
    importance: 'Important Tasks',
    urgency: 'Urgent Tasks',
    savings: 'Savings Opportunities'
  };

  const dimensionDescriptions = {
    importance: 'Highest long-term impact',
    urgency: 'Closest deadline / avoids penalties',
    savings: 'Savings, credits & refunds (no bills)'
  };

  return (
    <div className="min-h-screen bg-gray-900" data-testid="page-list">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800 border-b-2 border-gray-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setLocation('/dashboard')}
              className="p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg min-h-[60px] min-w-[60px]"
              data-testid="button-back"
              aria-label="Back to home"
            >
              <ArrowLeft className="text-xl w-6 h-6" />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-white" data-testid="title-dimension">
                {dimensionLabels[dimension]}
              </h1>
              <p className="text-sm text-gray-300" data-testid="text-dimension-description">
                {dimensionDescriptions[dimension]}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-600 p-8">
          {/* Filters */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}
            </h2>
            
            <div className="flex items-center space-x-4">
              <Select value={statusFilter} onValueChange={(value: TaskStatus | 'all') => setStatusFilter(value)}>
                <SelectTrigger className="w-40 min-h-[50px]" data-testid="select-status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={(value: 'all' | '7days') => setDateFilter(value)}>
                <SelectTrigger className="w-40 min-h-[50px]" data-testid="select-date-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-state">
              <p className="text-gray-300 text-xl">No tasks match your filters</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <div className="space-y-4" data-testid="task-list">
              {filteredTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  dimension={dimension}
                  onViewInstructions={handleViewInstructions}
                  onMarkDone={handleMarkDone}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          )}
        </div>
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
