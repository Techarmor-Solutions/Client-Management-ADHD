export type ClientStatus = 'active' | 'paused' | 'churned';
export type ContractType = 'retainer' | 'project-based';
export type ClientColor = string; // hex color e.g. '#4F7BF7'

export type ProjectStatus = 'active' | 'complete' | 'paused';

export type Priority = 'high' | 'medium' | 'low';
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';
export type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'paused';

export interface Client {
  id: string;
  user_id: string;
  name: string;
  status: ClientStatus;
  contract_type: ContractType;
  monthly_revenue: number;
  total_revenue: number;
  notes: string;
  color: ClientColor;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  client_id: string;
  name: string;
  status: ProjectStatus;
  due_date: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  client_id: string;
  project_id: string | null;
  title: string;
  due_date: string | null;
  priority: Priority;
  done: boolean;
  status: TaskStatus;
  recurrence: Recurrence;
  completed_at: string | null;
  parent_task_id: string | null;
  scheduled_date: string | null;
  created_at: string;
}

export type AppView = 'tasks' | 'clients' | 'client-detail' | 'review' | 'planner';

export interface NewTask {
  client_id: string;
  project_id?: string | null;
  title: string;
  due_date?: string | null;
  priority?: Priority;
  recurrence?: Recurrence;
  status?: TaskStatus;
  parent_task_id?: string | null;
  scheduled_date?: string | null;
}

export interface TaskNote {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface NewClient {
  name: string;
  status?: ClientStatus;
  contract_type?: ContractType;
  monthly_revenue?: number;
  total_revenue?: number;
  notes?: string;
  color?: ClientColor;
}

export interface NewProject {
  client_id: string;
  name: string;
  status?: ProjectStatus;
  due_date?: string | null;
}
