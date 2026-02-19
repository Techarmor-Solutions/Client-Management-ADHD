import { useState } from 'react';
import type { Project, Task, Client, TaskStatus } from '../../types';
import { TaskList } from '../tasks/TaskList';

interface ProjectTaskGroupProps {
  project: Project | null;
  tasks: Task[];
  clients: Client[];
  defaultOpen?: boolean;
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const statusColors: Record<string, string> = {
  active:   'bg-blue-100 text-blue-700',
  complete: 'bg-green-100 text-green-700',
  paused:   'bg-yellow-100 text-yellow-700',
};

export function ProjectTaskGroup({
  project,
  tasks,
  clients,
  defaultOpen = true,
  onComplete,
  onUncomplete,
  onEdit,
  onDelete,
  onStatusChange,
}: ProjectTaskGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  const pendingCount = tasks.filter(t => !t.done).length;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={`flex-shrink-0 text-[#6B6860] transition-transform ${open ? 'rotate-90' : ''}`}
        >
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* Name */}
        <span className="text-sm font-semibold text-[#1C1B18] flex-1 min-w-0 truncate">
          {project ? project.name : 'No Project'}
        </span>

        {/* Status badge */}
        {project && (
          <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium flex-shrink-0 ${statusColors[project.status]}`}>
            {project.status}
          </span>
        )}

        {/* Task count chip */}
        <span className="text-xs px-1.5 py-0.5 rounded-md bg-gray-100 text-[#6B6860] font-medium flex-shrink-0">
          {pendingCount} task{pendingCount !== 1 ? 's' : ''}
        </span>
      </button>

      {/* Body */}
      {open && (
        <div className="px-4 pb-4 pt-1">
          {tasks.length === 0 ? (
            <p className="text-sm text-[#6B6860] py-2">No tasks yet — use the bar below to add one.</p>
          ) : (
            <TaskList
              tasks={tasks}
              clients={clients}
              onComplete={onComplete}
              onUncomplete={onUncomplete}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
