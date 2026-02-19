import { useState } from 'react';
import type { Client, ClientStatus, ContractType, NewClient } from '../../types';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Select } from '../shared/Select';
import { CLIENT_STATUS_OPTIONS, CONTRACT_TYPE_OPTIONS } from '../../constants';
import { resolveColor } from '../../utils/colorUtils';

interface ClientEditModalProps {
  client?: Client;
  onSave: (data: NewClient | Partial<Client>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function ClientEditModal({ client, onSave, onDelete, onClose }: ClientEditModalProps) {
  const [name, setName] = useState(client?.name ?? '');
  const [status, setStatus] = useState<ClientStatus>(client?.status ?? 'active');
  const [contractType, setContractType] = useState<ContractType>(client?.contract_type ?? 'retainer');
  const [monthlyRevenue, setMonthlyRevenue] = useState(String(client?.monthly_revenue ?? ''));
  const [color, setColor] = useState(resolveColor(client?.color ?? '#4F7BF7'));
  const [notes, setNotes] = useState(client?.notes ?? '');

  const handleSave = async () => {
    if (!name.trim()) return;
    await onSave({
      name: name.trim(),
      status,
      contract_type: contractType,
      monthly_revenue: parseFloat(monthlyRevenue) || 0,
      color,
      notes,
    });
    onClose();
  };

  const handleDelete = () => {
    if (client && onDelete) {
      if (confirm(`Delete ${client.name}? This will also delete all their projects and tasks.`)) {
        onDelete(client.id);
        onClose();
      }
    }
  };

  return (
    <Modal
      title={client ? 'Edit Client' : 'New Client'}
      onClose={onClose}
      footer={
        <>
          {client && onDelete && (
            <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            {client ? 'Save' : 'Add Client'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Client name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
          placeholder="e.g. Acme Corp"
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Status"
            value={status}
            onChange={e => setStatus(e.target.value as ClientStatus)}
            options={CLIENT_STATUS_OPTIONS}
          />
          <Select
            label="Contract type"
            value={contractType}
            onChange={e => setContractType(e.target.value as ContractType)}
            options={CONTRACT_TYPE_OPTIONS}
          />
        </div>

        <Input
          label="Monthly revenue ($)"
          type="number"
          min="0"
          value={monthlyRevenue}
          onChange={e => setMonthlyRevenue(e.target.value)}
          placeholder="0"
        />

        {/* Color picker */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#1C1B18]">Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 p-0.5 bg-white"
              title="Pick client color"
            />
            <span className="text-sm text-[#6B6860] font-mono">{color}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#1C1B18]">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Any notes about this client…"
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-[#1C1B18] placeholder-[#6B6860] focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}
