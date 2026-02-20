import { useState } from 'react';
import type { Task, Client, Project, TaskStatus } from '../../types';
import { getWorkWeek } from '../../utils/dateUtils';
import { WeekGrid } from './WeekGrid';
import { DayView } from './DayView';
import { TaskEditModal } from '../tasks/TaskEditModal';

interface WeekPlannerViewProps {
  tasks: Task[];
  clients: Client[];
  projects: Project[];
  onUpdateTask: (id: string, updates: Partial<Pick<Task, 'title' | 'due_date' | 'priority' | 'recurrence' | 'client_id' | 'project_id' | 'done' | 'status' | 'scheduled_date'>>) => void;
  onCompleteTask: (id: string) => void;
  onUncompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function WeekPlannerView({
  tasks,
  clients,
  projects,
  onUpdateTask,
  onCompleteTask,
  onUncompleteTask,
  onDeleteTask,
}: WeekPlannerViewProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [dayView, setDayView] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const workWeek = getWorkWeek(weekOffset);

  const handleSchedule = (taskId: string, date: string | null) => {
    onUpdateTask(taskId, { scheduled_date: date });
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    onUpdateTask(id, { status });
  };

  const handleNavigateDay = (date: string) => {
    setDayView(date);
    // If navigating to a day outside the current week offset, adjust the week
    const targetWeek = getWorkWeek(weekOffset);
    if (!targetWeek.includes(date)) {
      // Find the right offset
      for (let offset = -52; offset <= 52; offset++) {
        if (getWorkWeek(offset).includes(date)) {
          setWeekOffset(offset);
          break;
        }
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ minHeight: 0 }}>
      {dayView ? (
        <DayView
          date={dayView}
          tasks={tasks}
          clients={clients}
          onBack={() => setDayView(null)}
          onSchedule={handleSchedule}
          onComplete={onCompleteTask}
          onUncomplete={onUncompleteTask}
          onEdit={setEditingTask}
          onDelete={onDeleteTask}
          onStatusChange={handleStatusChange}
          onNavigate={handleNavigateDay}
        />
      ) : (
        <WeekGrid
          workWeek={workWeek}
          tasks={tasks}
          clients={clients}
          weekOffset={weekOffset}
          onSchedule={handleSchedule}
          onComplete={onCompleteTask}
          onEdit={setEditingTask}
          onSelectDay={date => setDayView(date)}
          onWeekChange={setWeekOffset}
        />
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          clients={clients}
          projects={projects}
          onSave={(id, updates) => onUpdateTask(id, updates)}
          onDelete={id => { onDeleteTask(id); setEditingTask(null); }}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
