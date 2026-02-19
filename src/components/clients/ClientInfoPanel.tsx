import { useState } from 'react';
import type { Client, ClientStatus, ContractType } from '../../types';
import { CLIENT_STATUS_OPTIONS, CONTRACT_TYPE_OPTIONS } from '../../constants';
import { Button } from '../shared/Button';
import { resolveColor } from '../../utils/colorUtils';

interface ClientInfoPanelProps {
  client: Client;
  onUpdate: (updates: Partial<Client>) => void;
}

export function ClientInfoPanel({ client, onUpdate }: ClientInfoPanelProps) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(client.notes);

  const saveNotes = () => {
    onUpdate({ notes });
    setEditingNotes(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-[#1C1B18] mb-4">Client Info</h3>

      <div className="flex flex-col gap-3 text-sm">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-[#6B6860]">Status</span>
          <select
            value={client.status}
            onChange={e => onUpdate({ status: e.target.value as ClientStatus })}
            className="text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] bg-white"
          >
            {CLIENT_STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Contract type */}
        <div className="flex items-center justify-between">
          <span className="text-[#6B6860]">Contract</span>
          <select
            value={client.contract_type}
            onChange={e => onUpdate({ contract_type: e.target.value as ContractType })}
            className="text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] bg-white"
          >
            {CONTRACT_TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Monthly revenue */}
        <div className="flex items-center justify-between">
          <span className="text-[#6B6860]">Monthly</span>
          <InlineNumberEdit
            value={client.monthly_revenue}
            prefix="$"
            onSave={v => onUpdate({ monthly_revenue: v })}
          />
        </div>

        {/* Color */}
        <div className="flex items-center justify-between">
          <span className="text-[#6B6860]">Color</span>
          <input
            type="color"
            value={resolveColor(client.color)}
            onChange={e => onUpdate({ color: e.target.value })}
            className="w-8 h-8 rounded-full cursor-pointer border border-gray-200 p-0.5 bg-white"
            title="Change client color"
          />
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#6B6860]">Notes</span>
            {!editingNotes && (
              <button
                onClick={() => setEditingNotes(true)}
                className="text-xs text-[#4F7BF7] hover:underline"
              >
                Edit
              </button>
            )}
          </div>
          {editingNotes ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                autoFocus
                className="w-full px-3 py-2 text-sm bg-[#F7F6F3] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={() => { setNotes(client.notes); setEditingNotes(false); }}>Cancel</Button>
                <Button size="sm" onClick={saveNotes}>Save</Button>
              </div>
            </div>
          ) : (
            <p className="text-[#1C1B18] text-sm whitespace-pre-wrap leading-relaxed">
              {client.notes || <span className="text-[#6B6860] italic">No notes</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function InlineNumberEdit({
  value,
  prefix = '',
  onSave,
}: {
  value: number;
  prefix?: string;
  onSave: (v: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(String(value));

  if (editing) {
    return (
      <input
        type="number"
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={() => { onSave(parseFloat(text) || 0); setEditing(false); }}
        onKeyDown={e => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          if (e.key === 'Escape') { setText(String(value)); setEditing(false); }
        }}
        autoFocus
        className="w-24 text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] text-right"
      />
    );
  }

  return (
    <button
      onClick={() => { setText(String(value)); setEditing(true); }}
      className="text-sm font-medium text-[#1C1B18] hover:text-[#4F7BF7] transition-colors"
    >
      {prefix}{value.toLocaleString()}
    </button>
  );
}
