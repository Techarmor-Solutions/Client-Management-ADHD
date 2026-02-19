import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Client, NewClient } from '../types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setClients(data as Client[]);
        setLoading(false);
      });
  }, []);

  const addClient = async (newClient: NewClient): Promise<Client | null> => {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: newClient.name,
        status: newClient.status ?? 'active',
        contract_type: newClient.contract_type ?? 'retainer',
        monthly_revenue: newClient.monthly_revenue ?? 0,
        total_revenue: newClient.total_revenue ?? 0,
        notes: newClient.notes ?? '',
        color: newClient.color ?? 'slate',
      })
      .select()
      .single();

    if (!error && data) {
      setClients(prev => [...prev, data as Client]);
      return data as Client;
    }
    return null;
  };

  const updateClient = async (
    id: string,
    updates: Partial<Pick<Client, 'name' | 'status' | 'contract_type' | 'monthly_revenue' | 'total_revenue' | 'notes' | 'color'>>
  ) => {
    // Optimistic update
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    await supabase.from('clients').update(updates).eq('id', id);
  };

  const deleteClient = async (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    await supabase.from('clients').delete().eq('id', id);
  };

  return { clients, loading, addClient, updateClient, deleteClient };
}
