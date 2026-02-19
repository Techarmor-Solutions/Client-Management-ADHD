import { useState, useEffect } from 'react';
import type { Task, Client, Project, NewTask, TaskStatus } from '../../types';
import { sortTasks } from '../../utils/taskSorter';
import { TaskList } from './TaskList';
import { QuickAddBar } from './QuickAddBar';
import { WhatsNextButton } from './WhatsNextButton';
import { TaskEditModal } from './TaskEditModal';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface TaskListViewProps {
  tasks: Task[];
  clients: Client[];
  projects: Project[];
  tasksLoading: boolean;
  onAddTask: (task: NewTask) => Promise<unknown>;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onCompleteTask: (id: string) => void;
  onUncompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskListView({
  tasks,
  clients,
  projects,
  tasksLoading,
  onAddTask,
  onUpdateTask,
  onCompleteTask,
  onUncompleteTask,
  onDeleteTask,
}: TaskListViewProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // Keyboard shortcut: 'n' focuses quick add
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'n' && e.target === document.body) {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>('[placeholder*="Add a task"]');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleWhatsNext = () => {
    const pending = sortTasks(tasks.filter(t => !t.done));
    if (pending.length === 0) return;
    const next = pending[0];
    setHighlightId(next.id);
    // Scroll to highlighted row
    setTimeout(() => {
      const el = document.getElementById(`task-${next.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
    // Clear highlight after 3s
    setTimeout(() => setHighlightId(null), 3000);
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    onUpdateTask(id, { status });
  };

  const pendingCount = tasks.filter(t => !t.done).length;
  const overdueCount = tasks.filter(t => !t.done && t.due_date && t.due_date < new Date().toISOString().split('T')[0]).length;

  if (tasksLoading) return <LoadingSpinner message="Loading tasks…" />;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-6 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#1C1B18]">Tasks</h1>
            <p className="text-sm text-[#6B6860]">
              {pendingCount === 0
                ? 'All done!'
                : `${pendingCount} pending${overdueCount > 0 ? ` · ${overdueCount} overdue` : ''}`}
            </p>
          </div>
          <WhatsNextButton onClick={handleWhatsNext} />
        </div>
      </div>

      {/* Task list */}
      <div className="max-w-3xl mx-auto w-full px-4 flex-1 overflow-y-auto pb-4">
        <div id="task-list">
          <TaskList
            tasks={tasks}
            clients={clients}
            highlightTaskId={highlightId}
            onComplete={onCompleteTask}
            onUncomplete={onUncompleteTask}
            onEdit={setEditingTask}
            onDelete={onDeleteTask}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      {/* Quick add bar */}
      <QuickAddBar
        clients={clients}
        projects={projects}
        onAdd={onAddTask}
      />

      {/* Edit modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          clients={clients}
          projects={projects}
          onSave={onUpdateTask}
          onDelete={onDeleteTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
