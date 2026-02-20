import type { Task, Client } from '../../types';
import { resolveColor } from '../../utils/colorUtils';
import { isOverdue, formatDate } from '../../utils/dateUtils';
import { PRIORITY_OPTIONS } from '../../constants';

interface PlannerTaskCardProps {
  task: Task;
  client: Client | undefined;
  isDragging: boolean;
  onDragStart: () => void;
  onComplete: () => void;
  onEdit: () => void;
}

export function PlannerTaskCard({ task, client, isDragging, onDragStart, onComplete, onEdit }: PlannerTaskCardProps) {
  const clientColor = client ? resolveColor(client.color) : '#94A3B8';
  const overdue = !task.done && isOverdue(task.due_date);
  const priorityOption = PRIORITY_OPTIONS.find(p => p.value === task.priority);

  return (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart();
      }}
      onClick={onEdit}
      className={`relative rounded-lg border border-gray-100 bg-white shadow-sm cursor-grab active:cursor-grabbing select-none transition-opacity ${
        isDragging ? 'opacity-40' : 'opacity-100'
      } ${task.done ? 'opacity-50' : ''}`}
      style={{ borderLeftWidth: '3px', borderLeftColor: clientColor }}
    >
      <div className="px-2.5 py-2 pr-7">
        {/* Title */}
        <p className={`text-xs font-medium leading-snug truncate ${task.done ? 'line-through text-[#6B6860]' : 'text-[#1C1B18]'}`}>
          {task.title}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {priorityOption && task.priority !== 'medium' && (
            <span className={`text-[10px] px-1 py-0.5 rounded font-medium ${priorityOption.color}`}>
              {priorityOption.label}
            </span>
          )}
          {task.due_date && (
            <span className={`text-[10px] font-medium ${overdue ? 'text-red-600' : 'text-[#6B6860]'}`}>
              {overdue ? '⚠ ' : ''}{formatDate(task.due_date)}
            </span>
          )}
        </div>
      </div>

      {/* Complete button */}
      <button
        onClick={e => { e.stopPropagation(); onComplete(); }}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#4F7BF7] transition-colors flex-shrink-0"
        aria-label="Complete task"
      >
        {task.done && (
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="#4F7BF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
}
