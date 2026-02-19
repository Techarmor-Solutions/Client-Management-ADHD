import { useState } from 'react';
import type { Task, Client } from '../../types';
import { Button } from '../shared/Button';
import { ColorDot } from '../shared/ColorDot';
import { PriorityBadge } from '../shared/Badge';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import { sortTasks } from '../../utils/taskSorter';
import { getWeekBounds } from '../../utils/dateUtils';

interface ReviewStep3PlanProps {
  tasks: Task[];
  clients: Client[];
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
  onNext: () => void;
}

export function ReviewStep3Plan({ tasks, clients, onNext }: ReviewStep3PlanProps) {
  const { end } = getWeekBounds();
  const clientMap = new Map(clients.map(c => [c.id, c]));

  // Tasks due this week + overdue pending tasks
  const weekTasks = sortTasks(
    tasks.filter(t => !t.done && (isOverdue(t.due_date) || (t.due_date && t.due_date <= end)))
  );

  const [orderedIds, setOrderedIds] = useState(() => weekTasks.map(t => t.id));

  // Sync if tasks change
  const displayTasks = orderedIds
    .map(id => weekTasks.find(t => t.id === id))
    .filter(Boolean) as Task[];

  // Also add any new ones not in orderedIds
  const newTasks = weekTasks.filter(t => !orderedIds.includes(t.id));
  const allDisplayTasks = [...displayTasks, ...newTasks];

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...orderedIds];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setOrderedIds(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === allDisplayTasks.length - 1) return;
    const newOrder = [...orderedIds];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setOrderedIds(newOrder);
  };

  if (allDisplayTasks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">📅</div>
        <h2 className="text-lg font-bold text-[#1C1B18] mb-2">Nothing due this week</h2>
        <p className="text-[#6B6860] mb-6">Your week looks open. Add tasks from the main view.</p>
        <Button onClick={onNext}>Continue →</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#1C1B18]">Your week ahead</h2>
        <p className="text-sm text-[#6B6860]">{allDisplayTasks.length} tasks to focus on. Re-order if needed.</p>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {allDisplayTasks.map((task, i) => {
          const client = clientMap.get(task.client_id);
          const overdue = isOverdue(task.due_date);

          return (
            <div
              key={task.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${overdue ? 'bg-[#FEF2F2] border-red-100' : 'bg-white border-gray-100'}`}
            >
              {/* Priority indicator */}
              <span className="text-xs font-bold text-[#6B6860] w-5 text-center flex-shrink-0">
                {i + 1}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${overdue ? 'text-red-700' : 'text-[#1C1B18]'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {client && (
                    <span className="flex items-center gap-1 text-xs text-[#6B6860]">
                      <ColorDot color={client.color} size="sm" />
                      {client.name}
                    </span>
                  )}
                  {task.due_date && (
                    <span className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-[#6B6860]'}`}>
                      {overdue ? '⚠ ' : ''}{formatDate(task.due_date)}
                    </span>
                  )}
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>

              {/* Up/down controls */}
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="text-[#6B6860] hover:text-[#1C1B18] disabled:opacity-20 p-0.5 rounded"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => moveDown(i)}
                  disabled={i === allDisplayTasks.length - 1}
                  className="text-[#6B6860] hover:text-[#1C1B18] disabled:opacity-20 p-0.5 rounded"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Button className="w-full justify-center" onClick={onNext}>
        Looks good → Finish review
      </Button>
    </div>
  );
}
