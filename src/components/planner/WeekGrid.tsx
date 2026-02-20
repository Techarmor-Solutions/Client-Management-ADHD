import { useState } from 'react';
import type { Task, Client } from '../../types';
import { formatDayHeader } from '../../utils/dateUtils';
import { DayColumn } from './DayColumn';
import { BacklogPanel } from './BacklogPanel';

interface WeekGridProps {
  workWeek: string[];
  tasks: Task[];
  clients: Client[];
  weekOffset: number;
  onSchedule: (taskId: string, date: string | null) => void;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onSelectDay: (date: string) => void;
  onWeekChange: (offset: number) => void;
}

export function WeekGrid({
  workWeek,
  tasks,
  clients,
  weekOffset,
  onSchedule,
  onComplete,
  onEdit,
  onSelectDay,
  onWeekChange,
}: WeekGridProps) {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const handleDrop = (date: string | null) => {
    if (draggingTaskId) {
      onSchedule(draggingTaskId, date);
    }
    setDraggingTaskId(null);
  };

  // Week label: "Feb 17–21, 2026"
  const firstDay = workWeek[0];
  const lastDay = workWeek[4];
  const { date: firstLabel } = formatDayHeader(firstDay);
  const lastDate = new Date(lastDay + 'T00:00:00');
  const lastDayNum = lastDate.getDate();
  const year = lastDate.getFullYear();
  const weekLabel = `${firstLabel}–${lastDayNum}, ${year}`;

  const handleDragStart = (id: string) => setDraggingTaskId(id);

  // Clear drag state on dragend (in case drop happens outside any target)
  const handleDragEnd = () => setDraggingTaskId(null);

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      onDragEnd={handleDragEnd}
    >
      {/* Week navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <button
          onClick={() => onWeekChange(weekOffset - 1)}
          className="px-3 py-1.5 text-sm text-[#6B6860] hover:text-[#1C1B18] hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Prev
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#1C1B18]">Week of {weekLabel}</span>
          {weekOffset !== 0 && (
            <button
              onClick={() => onWeekChange(0)}
              className="text-xs px-2.5 py-1 bg-[#4F7BF7] text-white rounded-lg hover:bg-[#3d6ae0] transition-colors"
            >
              This Week
            </button>
          )}
        </div>

        <button
          onClick={() => onWeekChange(weekOffset + 1)}
          className="px-3 py-1.5 text-sm text-[#6B6860] hover:text-[#1C1B18] hover:bg-gray-100 rounded-lg transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Columns */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-3">
        <div className="flex gap-2 min-w-[900px] h-full">
          {workWeek.map(date => (
            <DayColumn
              key={date}
              date={date}
              tasks={tasks.filter(t => t.scheduled_date === date)}
              clients={clients}
              draggingTaskId={draggingTaskId}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onComplete={onComplete}
              onEdit={onEdit}
              onSelectDay={onSelectDay}
            />
          ))}

          <BacklogPanel
            tasks={tasks}
            clients={clients}
            workWeek={workWeek}
            draggingTaskId={draggingTaskId}
            onDragStart={handleDragStart}
            onDrop={() => handleDrop(null)}
            onEdit={onEdit}
            onComplete={onComplete}
          />
        </div>
      </div>
    </div>
  );
}
