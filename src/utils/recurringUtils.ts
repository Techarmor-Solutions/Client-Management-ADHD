import type { Recurrence } from '../types';

export function computeNextDueDate(current: string, recurrence: Recurrence): string {
  // Append time to avoid UTC shift bug
  const d = new Date(current + 'T00:00:00');
  if (recurrence === 'daily')   d.setDate(d.getDate() + 1);
  if (recurrence === 'weekly')  d.setDate(d.getDate() + 7);
  if (recurrence === 'monthly') d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
}
