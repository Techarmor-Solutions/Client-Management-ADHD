import type { Task, Client } from '../../types';
import { Button } from '../shared/Button';
import { ColorDot } from '../shared/ColorDot';
import { formatDate } from '../../utils/dateUtils';
import { todayString } from '../../utils/dateUtils';

interface ReviewStep1CatchupProps {
  tasks: Task[];
  clients: Client[];
  onComplete: (id: string) => void;
  onReschedule: (id: string, newDate: string) => void;
  onDelete: (id: string) => void;
  onNext: () => void;
}

export function ReviewStep1Catchup({
  tasks,
  clients,
  onComplete,
  onReschedule,
  onDelete,
  onNext,
}: ReviewStep1CatchupProps) {
  const today = todayString();
  const overdueTasks = tasks
    .filter(t => !t.done && t.due_date && t.due_date < today)
    .sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''));

  const clientMap = new Map(clients.map(c => [c.id, c]));

  if (overdueTasks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-[#1C1B18] mb-2">No overdue tasks!</h2>
        <p className="text-[#6B6860] mb-6">You're all caught up. Let's plan the week.</p>
        <Button onClick={onNext}>Continue →</Button>
      </div>
    );
  }

  const task = overdueTasks[0];
  const client = clientMap.get(task.client_id);
  const remaining = overdueTasks.length;

  // Tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Next week
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  return (
    <div>
      <div className="text-center mb-6">
        <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          {remaining} overdue {remaining === 1 ? 'task' : 'tasks'}
        </span>
        <h2 className="text-xl font-bold text-[#1C1B18]">What do you want to do with this?</h2>
      </div>

      {/* Single task card */}
      <div className="bg-[#FEF2F2] border border-red-200 rounded-2xl p-6 mb-6">
        {client && (
          <div className="flex items-center gap-1.5 mb-2">
            <ColorDot color={client.color} size="sm" />
            <span className="text-xs text-[#6B6860]">{client.name}</span>
          </div>
        )}
        <p className="text-lg font-semibold text-[#1C1B18] mb-1">{task.title}</p>
        <p className="text-sm text-red-600">Was due {formatDate(task.due_date)}</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={() => onComplete(task.id)}
        >
          ✓ Mark Done
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            onClick={() => onReschedule(task.id, tomorrowStr)}
          >
            📅 Tomorrow
          </Button>
          <Button
            variant="secondary"
            onClick={() => onReschedule(task.id, nextWeekStr)}
          >
            📅 Next week
          </Button>
        </div>

        <Button
          variant="danger"
          className="w-full justify-center"
          onClick={() => onDelete(task.id)}
        >
          🗑 Delete — not needed
        </Button>
      </div>

      {remaining === 1 && (
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={onNext}>Skip → Review clients</Button>
        </div>
      )}
    </div>
  );
}
