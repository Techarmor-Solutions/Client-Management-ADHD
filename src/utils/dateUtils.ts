export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function isOverdue(due_date: string | null): boolean {
  if (!due_date) return false;
  return due_date < todayString();
}

export function isToday(due_date: string | null): boolean {
  if (!due_date) return false;
  return due_date === todayString();
}

export function isThisWeek(due_date: string | null): boolean {
  if (!due_date) return false;
  const today = new Date();
  const due = new Date(due_date + 'T00:00:00');
  const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 6;
}

export function formatDate(due_date: string | null): string {
  if (!due_date) return '';
  const today = todayString();
  if (due_date === today) return 'Today';

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  if (due_date === tomorrowStr) return 'Tomorrow';

  const d = new Date(due_date + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateLong(due_date: string | null): string {
  if (!due_date) return '';
  const d = new Date(due_date + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatDateTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(' AM', ' am').replace(' PM', ' pm');
}

/** Returns the Mon–Fri YYYY-MM-DD strings for the week offsetWeeks away from today */
export function getWorkWeek(offsetWeeks = 0): string[] {
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon…
  const diff = day === 0 ? -6 : 1 - day; // roll back to Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + offsetWeeks * 7);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

/** "Mon" + "Feb 24" for column header */
export function formatDayHeader(dateStr: string): { weekday: string; date: string } {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  };
}

export function getWeekBounds(): { start: string; end: string } {
  const today = new Date();
  const start = today.toISOString().split('T')[0];
  const end = new Date(today);
  end.setDate(end.getDate() + 6);
  return { start, end: end.toISOString().split('T')[0] };
}
