import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Task, NewTask } from '../types';
import { computeNextDueDate } from '../utils/recurringUtils';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setTasks(data as Task[]);
        setLoading(false);
      });
  }, []);

  const addTask = async (newTask: NewTask): Promise<Task | null> => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        client_id: newTask.client_id,
        project_id: newTask.project_id ?? null,
        title: newTask.title,
        due_date: newTask.due_date ?? null,
        priority: newTask.priority ?? 'medium',
        done: false,
        status: newTask.status ?? 'not_started',
        recurrence: newTask.recurrence ?? 'none',
        completed_at: null,
        parent_task_id: newTask.parent_task_id ?? null,
        scheduled_date: newTask.scheduled_date ?? null,
      })
      .select()
      .single();

    if (!error && data) {
      setTasks(prev => [...prev, data as Task]);
      return data as Task;
    }
    return null;
  };

  const updateTask = async (
    id: string,
    updates: Partial<Pick<Task, 'title' | 'due_date' | 'priority' | 'recurrence' | 'client_id' | 'project_id' | 'done' | 'status' | 'scheduled_date'>>
  ) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    await supabase.from('tasks').update(updates).eq('id', id);
  };

  const completeTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const completedAt = new Date().toISOString();

    // Optimistic: mark done immediately
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: true, completed_at: completedAt } : t));

    await supabase
      .from('tasks')
      .update({ done: true, completed_at: completedAt })
      .eq('id', id);

    // Generate next recurrence if needed
    if (task.recurrence !== 'none' && task.due_date) {
      const nextDue = computeNextDueDate(task.due_date, task.recurrence);
      const { data: nextTask } = await supabase
        .from('tasks')
        .insert({
          client_id: task.client_id,
          project_id: task.project_id,
          title: task.title,
          due_date: nextDue,
          priority: task.priority,
          done: false,
          recurrence: task.recurrence,
          completed_at: null,
          parent_task_id: task.parent_task_id ?? task.id,
        })
        .select()
        .single();

      if (nextTask) {
        setTasks(prev => [...prev, nextTask as Task]);
      }
    }
  };

  const uncompleteTask = async (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: false, completed_at: null } : t));
    await supabase.from('tasks').update({ done: false, completed_at: null }).eq('id', id);
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  };

  return { tasks, loading, addTask, updateTask, completeTask, uncompleteTask, deleteTask };
}
