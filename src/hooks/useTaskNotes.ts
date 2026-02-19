import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { TaskNote } from '../types';

export function useTaskNotes(taskId: string) {
  const [notes, setNotes] = useState<TaskNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('task_notes')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setNotes(data as TaskNote[]);
        setLoading(false);
      });
  }, [taskId]);

  const addNote = async (content: string) => {
    const { data } = await supabase
      .from('task_notes')
      .insert({ task_id: taskId, content })
      .select()
      .single();
    if (data) setNotes(prev => [data as TaskNote, ...prev]);
  };

  return { notes, loading, addNote };
}
