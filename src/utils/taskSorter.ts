import type { Task } from '../types';
import { PRIORITY_ORDER } from '../constants';
import { todayString } from './dateUtils';

export function sortTasks(tasks: Task[]): Task[] {
  const today = todayString();
  return [...tasks].sort((a, b) => {
    const aOverdue = a.due_date !== null && a.due_date < today;
    const bOverdue = b.due_date !== null && b.due_date < today;

    // Overdue first
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // Then by due_date ascending (null last)
    if (a.due_date === null && b.due_date !== null) return 1;
    if (a.due_date !== null && b.due_date === null) return -1;
    if (a.due_date !== null && b.due_date !== null) {
      if (a.due_date < b.due_date) return -1;
      if (a.due_date > b.due_date) return 1;
    }

    // Then by priority
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });
}
