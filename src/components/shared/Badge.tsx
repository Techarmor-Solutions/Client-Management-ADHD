import type { Priority, Recurrence, ClientStatus } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const styles: Record<Priority, string> = {
    high:   'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low:    'bg-slate-100 text-slate-600',
  };
  const labels: Record<Priority, string> = {
    high: 'High', medium: 'Medium', low: 'Low',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
}

interface RecurrenceBadgeProps {
  recurrence: Recurrence;
}

export function RecurrenceBadge({ recurrence }: RecurrenceBadgeProps) {
  if (recurrence === 'none') return null;
  const labels: Record<Recurrence, string> = {
    none: '', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly',
  };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-teal-50 text-teal-700">
      🔁 {labels[recurrence]}
    </span>
  );
}

interface StatusBadgeProps {
  status: ClientStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<ClientStatus, string> = {
    active:  'bg-green-100 text-green-700',
    paused:  'bg-yellow-100 text-yellow-700',
    churned: 'bg-slate-100 text-slate-500',
  };
  const labels: Record<ClientStatus, string> = {
    active: 'Active', paused: 'Paused', churned: 'Churned',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
