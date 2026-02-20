import { useState } from 'react';
import type { Task, Client, TaskStatus } from '../../types';
import { formatDayHeader, todayString, isOverdue } from '../../utils/dateUtils';
import { TaskRow } from '../tasks/TaskRow';

interface DayViewProps {
  date: string;
  tasks: Task[];
  clients: Client[];
  onBack: () => void;
  onSchedule: (id: string, date: string | null) => void;
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onNavigate: (date: string) => void;
}

function adjacentWorkday(dateStr: string, delta: 1 | -1): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  // Skip weekends
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + delta);
  }
  return d.toISOString().split('T')[0];
}

export function DayView({
  date,
  tasks,
  clients,
  onBack,
  onSchedule,
  onComplete,
  onUncomplete,
  onEdit,
  onDelete,
  onStatusChange,
  onNavigate,
}: DayViewProps) {
  const [completedOpen, setCompletedOpen] = useState(false);
  const { weekday } = formatDayHeader(date);

  const prevDay = adjacentWorkday(date, -1);
  const nextDay = adjacentWorkday(date, 1);
  const { weekday: prevWeekday } = formatDayHeader(prevDay);
  const { weekday: nextWeekday } = formatDayHeader(nextDay);

  const today = todayString();

  // Tasks scheduled for this day (pending)
  const scheduled = tasks.filter(t => !t.done && t.scheduled_date === date);

  // Due today but NOT scheduled for today (and not done)
  const dueUnscheduled = tasks.filter(t => !t.done && t.due_date === date && t.scheduled_date !== date);

  // Completed tasks that were scheduled for today OR completed today
  const completed = tasks.filter(t => {
    if (!t.done) return false;
    if (t.scheduled_date === date) return true;
    if (t.completed_at) {
      return t.completed_at.split('T')[0] === date;
    }
    return false;
  });

  const isToday = date === today;

  // Header date display
  const d = new Date(date + 'T00:00:00');
  const fullDateLabel = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Day nav header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#6B6860] hover:text-[#1C1B18] hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Week view
        </button>

        <div className="flex items-center gap-1">
          <span className={`text-sm font-semibold ${isToday ? 'text-[#4F7BF7]' : 'text-[#1C1B18]'}`}>
            {fullDateLabel}
            {isToday && <span className="ml-2 text-xs bg-[#4F7BF7] text-white px-2 py-0.5 rounded-full">Today</span>}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigate(prevDay)}
            className="px-3 py-1.5 text-sm text-[#6B6860] hover:text-[#1C1B18] hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← {prevWeekday}
          </button>
          <button
            onClick={() => onNavigate(nextDay)}
            className="px-3 py-1.5 text-sm text-[#6B6860] hover:text-[#1C1B18] hover:bg-gray-100 rounded-lg transition-colors"
          >
            {nextWeekday} →
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
        {/* Scheduled for today */}
        <Section
          title={`Scheduled for ${weekday}`}
          count={scheduled.length}
          empty="Nothing scheduled — drag tasks here from the week grid."
        >
          {scheduled.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              client={clients.find(c => c.id === task.client_id)}
              onComplete={onComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </Section>

        {/* Due today but unscheduled */}
        {dueUnscheduled.length > 0 && (
          <Section
            title="Due today but unscheduled"
            count={dueUnscheduled.length}
          >
            {dueUnscheduled.map(task => (
              <div key={task.id} className="flex flex-col gap-1">
                <TaskRow
                  task={task}
                  client={clients.find(c => c.id === task.client_id)}
                  onComplete={onComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
                <button
                  onClick={() => onSchedule(task.id, date)}
                  className="self-start ml-4 text-xs text-[#4F7BF7] hover:underline"
                >
                  + Schedule for {weekday}
                </button>
              </div>
            ))}
          </Section>
        )}

        {/* Overdue tasks (not due today, not scheduled today) */}
        {isToday && (() => {
          const overdue = tasks.filter(t => !t.done && isOverdue(t.due_date) && t.scheduled_date !== date && t.due_date !== date);
          if (overdue.length === 0) return null;
          return (
            <Section title="Overdue" count={overdue.length}>
              {overdue.map(task => (
                <div key={task.id} className="flex flex-col gap-1">
                  <TaskRow
                    task={task}
                    client={clients.find(c => c.id === task.client_id)}
                    onComplete={onComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                  <button
                    onClick={() => onSchedule(task.id, date)}
                    className="self-start ml-4 text-xs text-[#4F7BF7] hover:underline"
                  >
                    + Schedule for today
                  </button>
                </div>
              ))}
            </Section>
          );
        })()}

        {/* Completed */}
        {completed.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => setCompletedOpen(o => !o)}
              className="flex items-center gap-2 text-sm font-semibold text-[#6B6860] hover:text-[#1C1B18] transition-colors mb-2"
            >
              <span>Completed ({completed.length})</span>
              <span className="text-xs">{completedOpen ? '▾' : '▸'}</span>
            </button>

            {completedOpen && (
              <div className="flex flex-col gap-2">
                {completed.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    client={clients.find(c => c.id === task.client_id)}
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

        {scheduled.length === 0 && dueUnscheduled.length === 0 && completed.length === 0 && (
          <div className="text-center py-16 text-[#6B6860]">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-sm">Nothing here. Drag tasks from the week grid to schedule them.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, count, empty, children }: { title: string; count: number; empty?: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-[#1C1B18] mb-2 flex items-center gap-2">
        {title}
        <span className="text-xs font-normal bg-gray-100 text-[#6B6860] px-1.5 py-0.5 rounded-full">{count}</span>
      </h3>
      {count === 0 && empty ? (
        <p className="text-xs text-[#6B6860] italic pl-1">{empty}</p>
      ) : (
        <div className="flex flex-col gap-2">{children}</div>
      )}
    </div>
  );
}
