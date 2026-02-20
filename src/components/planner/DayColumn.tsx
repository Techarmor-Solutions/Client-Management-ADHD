import type { Task, Client } from '../../types';
import { formatDayHeader, todayString } from '../../utils/dateUtils';
import { PlannerTaskCard } from './PlannerTaskCard';
import { PRIORITY_ORDER } from '../../constants';

interface DayColumnProps {
  date: string;
  tasks: Task[];
  clients: Client[];
  draggingTaskId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (date: string) => void;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onSelectDay: (date: string) => void;
}

export function DayColumn({ date, tasks, clients, draggingTaskId, onDragStart, onDrop, onComplete, onEdit, onSelectDay }: DayColumnProps) {
  const { weekday, date: dateLabel } = formatDayHeader(date);
  const isToday = date === todayString();

  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });

  const pending = sorted.filter(t => !t.done);
  const done = sorted.filter(t => t.done);

  return (
    <div
      className="flex flex-col min-w-[160px] flex-1"
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); onDrop(date); }}
    >
      {/* Header */}
      <button
        onClick={() => onSelectDay(date)}
        className={`flex flex-col items-center py-2 px-1 rounded-t-lg transition-colors hover:bg-blue-50 ${
          isToday ? 'border-t-2 border-[#4F7BF7] bg-blue-50' : 'border-t-2 border-transparent bg-gray-50'
        }`}
      >
        <span className={`text-xs font-bold uppercase tracking-wide ${isToday ? 'text-[#4F7BF7]' : 'text-[#6B6860]'}`}>
          {weekday}
        </span>
        <span className={`text-sm font-semibold ${isToday ? 'text-[#4F7BF7]' : 'text-[#1C1B18]'}`}>
          {dateLabel}
        </span>
        {tasks.length > 0 && (
          <span className="text-[10px] text-[#6B6860] mt-0.5">{pending.length} task{pending.length !== 1 ? 's' : ''}</span>
        )}
      </button>

      {/* Drop zone */}
      <div className="flex-1 flex flex-col gap-1.5 p-1.5 min-h-[200px] bg-white border border-gray-100 rounded-b-lg">
        {pending.map(task => (
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

        {pending.length === 0 && (
          <div className={`flex-1 flex items-center justify-center border-2 border-dashed rounded-lg min-h-[80px] transition-colors ${
            draggingTaskId ? 'border-[#4F7BF7] bg-blue-50' : 'border-gray-200'
          }`}>
            <span className="text-[11px] text-[#6B6860]">Drop here</span>
          </div>
        )}

        {done.length > 0 && (
          <div className="mt-1 border-t border-gray-100 pt-1.5 flex flex-col gap-1">
            {done.map(task => (
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
        )}
      </div>
    </div>
  );
}
