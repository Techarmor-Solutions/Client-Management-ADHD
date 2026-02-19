import type { Task, Client } from '../../types';
import { Button } from '../shared/Button';
import { todayString, getWeekBounds } from '../../utils/dateUtils';

interface ReviewStep4DoneProps {
  tasks: Task[];
  clients: Client[];
  onStartWeek: () => void;
}

export function ReviewStep4Done({ tasks, clients, onStartWeek }: ReviewStep4DoneProps) {
  const today = todayString();
  const { end: weekEnd } = getWeekBounds();

  const pendingThisWeek = tasks.filter(
    t => !t.done && t.due_date && t.due_date >= today && t.due_date <= weekEnd
  ).length;

  const overdueCount = tasks.filter(
    t => !t.done && t.due_date && t.due_date < today
  ).length;

  const totalPending = tasks.filter(t => !t.done).length;

  const activeClients = clients.filter(c => c.status === 'active').length;

  const monthlyRevenue = clients
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + (c.monthly_revenue ?? 0), 0);

  const completedToday = tasks.filter(
    t => t.done && t.completed_at && t.completed_at.startsWith(today)
  ).length;

  return (
    <div className="text-center">
      <div className="text-5xl mb-4">🚀</div>
      <h2 className="text-2xl font-bold text-[#1C1B18] mb-2">Week reviewed!</h2>
      <p className="text-[#6B6860] mb-8">You're set up for a great week.</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-8 text-left">
        <StatCard
          label="Due this week"
          value={String(pendingThisWeek)}
          color="blue"
        />
        <StatCard
          label="Total pending"
          value={String(totalPending)}
          color="default"
        />
        {overdueCount > 0 && (
          <StatCard
            label="Still overdue"
            value={String(overdueCount)}
            color="red"
          />
        )}
        {completedToday > 0 && (
          <StatCard
            label="Done today"
            value={String(completedToday)}
            color="green"
          />
        )}
        <StatCard
          label="Active clients"
          value={String(activeClients)}
          color="default"
        />
        {monthlyRevenue > 0 && (
          <StatCard
            label="Monthly revenue"
            value={`$${monthlyRevenue.toLocaleString()}`}
            color="green"
          />
        )}
      </div>

      <Button size="lg" className="w-full justify-center" onClick={onStartWeek}>
        Start Your Week →
      </Button>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: 'blue' | 'red' | 'green' | 'default' }) {
  const bgColors = {
    blue:    'bg-blue-50',
    red:     'bg-red-50',
    green:   'bg-green-50',
    default: 'bg-[#F7F6F3]',
  };
  const valColors = {
    blue:    'text-[#4F7BF7]',
    red:     'text-red-600',
    green:   'text-green-700',
    default: 'text-[#1C1B18]',
  };

  return (
    <div className={`${bgColors[color]} rounded-xl p-4`}>
      <p className={`text-2xl font-bold ${valColors[color]}`}>{value}</p>
      <p className="text-xs text-[#6B6860] mt-0.5">{label}</p>
    </div>
  );
}
