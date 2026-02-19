import { useState } from 'react';
import type { Task, Client, TaskStatus } from '../../types';
import { sortTasks } from '../../utils/taskSorter';
import { TaskRow } from './TaskRow';
import { CompletedTasksToggle } from './CompletedTasksToggle';
import { EmptyState } from '../shared/EmptyState';

interface TaskListProps {
  tasks: Task[];
  clients: Client[];
  highlightTaskId?: string | null;
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export function TaskList({ tasks, clients, highlightTaskId, onComplete, onUncomplete, onEdit, onDelete, onStatusChange }: TaskListProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const clientMap = new Map(clients.map(c => [c.id, c]));

  const pendingTasks = sortTasks(tasks.filter(t => !t.done));
  const completedTasks = tasks.filter(t => t.done).sort((a, b) => {
    if (!a.completed_at || !b.completed_at) return 0;
    return b.completed_at.localeCompare(a.completed_at);
  });

  if (pendingTasks.length === 0 && completedTasks.length === 0) {
    return (
      <EmptyState
        icon="🎉"
        title="No tasks yet"
        description="Add your first task using the bar below."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {pendingTasks.length === 0 && (
        <EmptyState
          icon="✅"
          title="All caught up!"
          description="No pending tasks. Add something new below."
        />
      )}

      {pendingTasks.map(task => (
        <TaskRow
          key={task.id}
          task={task}
          client={clientMap.get(task.client_id)}
          onComplete={onComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          highlight={task.id === highlightTaskId}
        />
      ))}

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
                  onComplete={onUncomplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
