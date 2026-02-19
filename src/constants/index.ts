import type { Priority, Recurrence, ContractType, ClientStatus, ProjectStatus, TaskStatus } from '../types';

export const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'high',   label: 'High',   color: 'bg-orange-100 text-orange-700' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'low',    label: 'Low',    color: 'bg-slate-100 text-slate-600' },
];

export const RECURRENCE_OPTIONS: { value: Recurrence; label: string }[] = [
  { value: 'none',    label: 'No repeat' },
  { value: 'daily',   label: 'Daily' },
  { value: 'weekly',  label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const CONTRACT_TYPE_OPTIONS: { value: ContractType; label: string }[] = [
  { value: 'retainer',      label: 'Retainer' },
  { value: 'project-based', label: 'Project-Based' },
];

export const CLIENT_STATUS_OPTIONS: { value: ClientStatus; label: string }[] = [
  { value: 'active',  label: 'Active' },
  { value: 'paused',  label: 'Paused' },
  { value: 'churned', label: 'Churned' },
];

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'active',   label: 'Active' },
  { value: 'complete', label: 'Complete' },
  { value: 'paused',   label: 'Paused' },
];

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'not_started', label: 'Not started', color: 'bg-gray-100 text-gray-500'      },
  { value: 'in_progress', label: 'In progress', color: 'bg-blue-100 text-blue-700'      },
  { value: 'blocked',     label: 'Blocked',     color: 'bg-red-100 text-red-600'        },
  { value: 'paused',      label: 'Paused',      color: 'bg-yellow-100 text-yellow-700'  },
];
