import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Project, NewProject } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setProjects(data as Project[]);
        setLoading(false);
      });
  }, []);

  const addProject = async (newProject: NewProject): Promise<Project | null> => {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        client_id: newProject.client_id,
        name: newProject.name,
        status: newProject.status ?? 'active',
        due_date: newProject.due_date ?? null,
      })
      .select()
      .single();

    if (!error && data) {
      setProjects(prev => [...prev, data as Project]);
      return data as Project;
    }
    return null;
  };

  const updateProject = async (
    id: string,
    updates: Partial<Pick<Project, 'name' | 'status' | 'due_date'>>
  ) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    await supabase.from('projects').update(updates).eq('id', id);
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    await supabase.from('projects').delete().eq('id', id);
  };

  return { projects, loading, addProject, updateProject, deleteProject };
}
