import type { Task, Client, TaskStatus } from '../../types';
import { PriorityBadge, RecurrenceBadge } from '../shared/Badge';
import { ColorDot } from '../shared/ColorDot';
import { formatDate, isOverdue, isToday } from '../../utils/dateUtils';
import { TASK_STATUS_OPTIONS } from '../../constants';

interface TaskRowProps {
  task: Task;
  client: Client | undefined;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  highlight?: boolean;
}

export function TaskRow({ task, client, onComplete, onEdit, onDelete, onStatusChange, highlight }: TaskRowProps) {
  const overdue = !task.done && isOverdue(task.due_date);
  const today = !task.done && isToday(task.due_date);

  const rowBg = overdue
    ? 'bg-[#FEF2F2] border-red-100'
    : highlight
    ? 'bg-blue-50 border-blue-200 ring-2 ring-[#4F7BF7]'
    : 'bg-white border-gray-100';

  const currentStatusColor = TASK_STATUS_OPTIONS.find(o => o.value === task.status)?.color ?? 'bg-gray-100 text-gray-500';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${rowBg} ${task.done ? 'opacity-50' : ''}`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onComplete(task.id)}
        className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#4F7BF7] transition-colors min-touch"
        aria-label={task.done ? 'Mark incomplete' : 'Complete task'}
      >
        {task.done && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="#4F7BF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium truncate ${task.done ? 'line-through text-[#6B6860]' : 'text-[#1C1B18]'}`}>
            {task.title}
          </span>
          {task.recurrence !== 'none' && <RecurrenceBadge recurrence={task.recurrence} />}
        </div>

        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {/* Client */}
          {client && (
            <span className="flex items-center gap-1 text-xs text-[#6B6860]">
              <ColorDot color={client.color} size="sm" />
              {client.name}
            </span>
          )}

          {/* Due date */}
          {task.due_date && (
            <span className={`text-xs font-medium ${overdue ? 'text-red-600' : today ? 'text-blue-600' : 'text-[#6B6860]'}`}>
              {overdue ? '⚠ ' : ''}{formatDate(task.due_date)}
            </span>
          )}

          {/* Priority badge */}
          <PriorityBadge priority={task.priority} />

          {/* Status */}
          {task.done ? (
            <span className="text-xs px-1.5 py-0.5 rounded-md font-medium bg-green-100 text-green-700">Done</span>
          ) : (
            <select
              value={task.status}
              onChange={e => onStatusChange(task.id, e.target.value as TaskStatus)}
              onClick={e => e.stopPropagation()}
              className={`text-xs px-1.5 py-0.5 rounded-md font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#4F7BF7] ${currentStatusColor}`}
            >
              {TASK_STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="text-[#6B6860] hover:text-[#1C1B18] hover:bg-gray-100 rounded-lg p-1.5 transition-colors min-touch"
          aria-label="Edit task"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-[#6B6860] hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 transition-colors min-touch"
          aria-label="Delete task"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5h6.6L11 3.5H3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
