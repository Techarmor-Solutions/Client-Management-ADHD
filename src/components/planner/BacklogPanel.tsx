import type { Task, Client } from '../../types';
import { isOverdue } from '../../utils/dateUtils';
import { PRIORITY_ORDER } from '../../constants';
import { PlannerTaskCard } from './PlannerTaskCard';

interface BacklogPanelProps {
  tasks: Task[];
  clients: Client[];
  workWeek: string[];
  draggingTaskId: string | null;
  onDragStart: (id: string) => void;
  onDrop: () => void;
  onEdit: (task: Task) => void;
  onComplete: (id: string) => void;
}

export function BacklogPanel({ tasks, clients, workWeek, draggingTaskId, onDragStart, onDrop, onEdit, onComplete }: BacklogPanelProps) {
  // Backlog = pending tasks not scheduled in this work week
  const backlog = tasks.filter(t => !t.done && (!t.scheduled_date || !workWeek.includes(t.scheduled_date)));

  // Sort: overdue first, then by due_date ascending, then by priority
  const sorted = [...backlog].sort((a, b) => {
    const aOverdue = isOverdue(a.due_date);
    const bOverdue = isOverdue(b.due_date);
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    if (a.due_date && !b.due_date) return -1;
    if (!a.due_date && b.due_date) return 1;
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });

  return (
    <div
      className="flex flex-col min-w-[160px] flex-1"
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); onDrop(); }}
    >
      {/* Header */}
      <div className="flex flex-col items-center py-2 px-1 bg-gray-50 border-t-2 border-gray-200 rounded-t-lg">
        <span className="text-xs font-bold uppercase tracking-wide text-[#6B6860]">Backlog</span>
        <span className="text-[10px] text-[#6B6860] mt-0.5">{sorted.length} unscheduled</span>
      </div>

      {/* Drop zone + list */}
      <div className={`flex-1 flex flex-col gap-1.5 p-1.5 min-h-[200px] border border-gray-100 rounded-b-lg transition-colors ${
        draggingTaskId ? 'bg-amber-50' : 'bg-white'
      }`}>
        {sorted.length === 0 && (
          <div className={`flex-1 flex items-center justify-center border-2 border-dashed rounded-lg min-h-[80px] transition-colors ${
            draggingTaskId ? 'border-amber-400 bg-amber-50' : 'border-gray-200'
          }`}>
            <span className="text-[11px] text-[#6B6860] text-center px-2">
              {draggingTaskId ? 'Drop to unschedule' : 'All scheduled!'}
            </span>
          </div>
        )}

        {sorted.map(task => (
          <PlannerTaskCard
            key={task.id}
            task={task}
            client={clients.find(c => c.id === task.client_id)}
            isDragging={draggingTaskId === task.id}
            onDragStart={() => onDragStart(task.id)}
            onComplete={() => onComplete(task.id)}
            onEdit={() => onEdit(task)}
          />
        ))}
      </div>
    </div>
  );
}
