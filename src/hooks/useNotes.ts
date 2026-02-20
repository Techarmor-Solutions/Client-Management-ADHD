import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Note } from '../types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setNotes(data as Note[]);
        setLoading(false);
      });
  }, []);

  const addNote = async (content: string): Promise<Note | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('notes')
      .insert({ content, user_id: user?.id })
      .select()
      .single();

    if (error) {
      console.error('Failed to save note:', error.message);
      return null;
    }
    if (data) {
      setNotes(prev => [data as Note, ...prev]);
      return data as Note;
    }
    return null;
  };

  const updateNote = async (id: string, content: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content, updated_at: new Date().toISOString() } : n));
    await supabase.from('notes').update({ content, updated_at: new Date().toISOString() }).eq('id', id);
  };

  const deleteNote = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    await supabase.from('notes').delete().eq('id', id);
  };

  return { notes, loading, addNote, updateNote, deleteNote };
}
