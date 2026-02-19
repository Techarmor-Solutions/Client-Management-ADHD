import { useState, useEffect } from 'react';
import type { Task, Client, Project, NewTask, TaskStatus } from '../../types';
import { sortTasks } from '../../utils/taskSorter';
import { isOverdue } from '../../utils/dateUtils';
import { resolveColor } from '../../utils/colorUtils';
import { TaskList } from './TaskList';
import { TaskRow } from './TaskRow';
import { CompletedTasksToggle } from './CompletedTasksToggle';
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
  const [groupByClient, setGroupByClient] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

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
    setTimeout(() => {
      const el = document.getElementById(`task-${next.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
    setTimeout(() => setHighlightId(null), 3000);
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    onUpdateTask(id, { status });
  };

  const clientMap = new Map(clients.map(c => [c.id, c]));
  const pendingTasks = sortTasks(tasks.filter(t => !t.done));
  const completedTasks = tasks.filter(t => t.done).sort((a, b) => {
    if (!a.completed_at || !b.completed_at) return 0;
    return b.completed_at.localeCompare(a.completed_at);
  });

  // Build sorted client groups for grouped view
  const pendingByClient = new Map<string, Task[]>();
  for (const task of pendingTasks) {
    const arr = pendingByClient.get(task.client_id) ?? [];
    arr.push(task);
    pendingByClient.set(task.client_id, arr);
  }
  const sortedGroups = [...pendingByClient.entries()].sort(([aId, aTasks], [bId, bTasks]) => {
    const aOverdue = aTasks.some(t => isOverdue(t.due_date));
    const bOverdue = bTasks.some(t => isOverdue(t.due_date));
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
    return (clientMap.get(aId)?.name ?? '').localeCompare(clientMap.get(bId)?.name ?? '');
  });

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGroupByClient(v => !v)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                groupByClient
                  ? 'bg-[#4F7BF7] text-white border-[#4F7BF7]'
                  : 'bg-white text-[#6B6860] border-gray-200 hover:border-gray-300'
              }`}
            >
              By client
            </button>
            <WhatsNextButton onClick={handleWhatsNext} />
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="max-w-3xl mx-auto w-full px-4 flex-1 overflow-y-auto pb-4">
        {groupByClient ? (
          <div className="flex flex-col gap-4">
            {pendingTasks.length === 0 && (
              <p className="text-center text-sm text-[#6B6860] py-8">All caught up! No pending tasks.</p>
            )}

            {sortedGroups.map(([clientId, groupTasks]) => {
              const client = clientMap.get(clientId);
              const clientColor = client ? resolveColor(client.color) : '#94A3B8';
              const groupOverdue = groupTasks.filter(t => isOverdue(t.due_date)).length;

              return (
                <div key={clientId}>
                  {/* Group header */}
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: clientColor }}
                    />
                    <span className="text-sm font-semibold text-[#1C1B18]">
                      {client?.name ?? 'Unknown client'}
                    </span>
                    <span className="text-xs text-[#6B6860]">
                      {groupTasks.length} task{groupTasks.length !== 1 ? 's' : ''}
                    </span>
                    {groupOverdue > 0 && (
                      <span className="text-xs font-semibold text-red-600">
                        ⚠ {groupOverdue} overdue
                      </span>
                    )}
                  </div>

                  {/* Tasks */}
                  <div className="flex flex-col gap-2">
                    {groupTasks.map(task => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        client={client}
                        onComplete={onCompleteTask}
                        onEdit={setEditingTask}
                        onDelete={onDeleteTask}
                        onStatusChange={handleStatusChange}
                        highlight={task.id === highlightId}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Completed tasks (grouped mode) */}
            {completedTasks.length > 0 && (
              <div className="mt-2">
                <CompletedTasksToggle
                  count={completedTasks.length}
                  expanded={showCompleted}
                  onToggle={() => setShowCompleted(v => !v)}
                />
                {showCompleted && (
                  <div className="flex flex-col gap-2 mt-2">
                    {completedTasks.map(task => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        client={clientMap.get(task.client_id)}
                        onComplete={onUncompleteTask}
                        onEdit={setEditingTask}
                        onDelete={onDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
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
        )}
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
