import { useState } from 'react';
import type { Client, Task, NewClient } from '../../types';
import { ClientCard } from './ClientCard';
import { ClientEditModal } from './ClientEditModal';
import { Button } from '../shared/Button';
import { EmptyState } from '../shared/EmptyState';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { todayString } from '../../utils/dateUtils';

interface ClientListViewProps {
  clients: Client[];
  tasks: Task[];
  clientsLoading: boolean;
  onAddClient: (data: NewClient) => void;
  onUpdateClient: (id: string, updates: Partial<Client>) => void;
  onDeleteClient: (id: string) => void;
  onSelectClient: (clientId: string) => void;
}

export function ClientListView({
  clients,
  tasks,
  clientsLoading,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onSelectClient,
}: ClientListViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'churned'>('all');

  const today = todayString();

  const getClientStats = (clientId: string) => {
    const clientTasks = tasks.filter(t => t.client_id === clientId && !t.done);
    const overdueCount = clientTasks.filter(t => t.due_date && t.due_date < today).length;
    return { taskCount: clientTasks.length, overdueCount };
  };

  const filteredClients = filter === 'all' ? clients : clients.filter(c => c.status === filter);

  const totalRevenue = clients
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + (c.monthly_revenue ?? 0), 0);

  if (clientsLoading) return <LoadingSpinner message="Loading clients…" />;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1C1B18]">Clients</h1>
          {totalRevenue > 0 && (
            <p className="text-sm text-[#6B6860]">
              ${totalRevenue.toLocaleString()}/mo from {clients.filter(c => c.status === 'active').length} active
            </p>
          )}
        </div>
        <Button onClick={() => setShowAddModal(true)}>+ New Client</Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
        {(['all', 'active', 'paused', 'churned'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors min-touch ${
              filter === f ? 'bg-[#4F7BF7] text-white' : 'text-[#6B6860] hover:bg-gray-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Client grid */}
      {filteredClients.length === 0 ? (
        <EmptyState
          icon="👥"
          title={filter === 'all' ? 'No clients yet' : `No ${filter} clients`}
          description={filter === 'all' ? 'Add your first client to get started.' : undefined}
          action={filter === 'all' ? <Button onClick={() => setShowAddModal(true)}>+ New Client</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredClients.map(client => {
            const { taskCount, overdueCount } = getClientStats(client.id);
            return (
              <ClientCard
                key={client.id}
                client={client}
                taskCount={taskCount}
                overdueCount={overdueCount}
                onClick={() => onSelectClient(client.id)}
                onEdit={() => setEditingClient(client)}
              />
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <ClientEditModal
          onSave={data => onAddClient(data as NewClient)}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingClient && (
        <ClientEditModal
          client={editingClient}
          onSave={data => onUpdateClient(editingClient.id, data)}
          onDelete={onDeleteClient}
          onClose={() => setEditingClient(null)}
        />
      )}
    </div>
  );
}
