import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import type { Client, Project, Priority, Recurrence, NewTask } from '../../types';
import { PRIORITY_OPTIONS, RECURRENCE_OPTIONS } from '../../constants';

interface QuickAddBarProps {
  clients: Client[];
  projects?: Project[];
  defaultClientId?: string;
  onAdd: (task: NewTask) => Promise<unknown>;
}

export function QuickAddBar({ clients, projects, defaultClientId, onAdd }: QuickAddBarProps) {
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState(defaultClientId ?? clients[0]?.id ?? '');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority>('medium');
  const [recurrence, setRecurrence] = useState<Recurrence>('none');
  const [dueDate, setDueDate] = useState('');
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync clientId with defaultClientId or ensure it's valid within clientOptions
  useEffect(() => {
    if (defaultClientId) {
      setClientId(defaultClientId);
      return;
    }
    if (clients.length > 0) {
      const active = clients.filter(c => c.status === 'active');
      const options = active.length > 0 ? active : clients;
      if (!clientId || !options.find(c => c.id === clientId)) {
        setClientId(options[0].id);
      }
    }
  }, [clients, defaultClientId]); // clientId intentionally excluded to avoid loop

  // Reset projectId when clientId changes so stale project isn't carried over
  useEffect(() => {
    setProjectId(null);
  }, [clientId]);

  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed || !clientId) return;
    setAdding(true);
    await onAdd({
      title: trimmed,
      client_id: clientId,
      project_id: projectId,
      priority,
      recurrence,
      due_date: dueDate || null,
    });
    // Clear title only; preserve client + recurrence for rapid entry
    setTitle('');
    setDueDate('');
    setAdding(false);
    // Re-focus input
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const activeClients = clients.filter(c => c.status === 'active');
  const clientOptions = activeClients.length > 0 ? activeClients : clients;
  const projectOptions = projects?.filter(p => p.client_id === clientId) ?? [];

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 shadow-lg z-30">
      <div className="max-w-3xl mx-auto px-4 py-3 flex flex-col gap-2">
        {/* Title input — full width row */}
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Add a task… (press Enter)"
          className="w-full px-3 py-2 text-sm bg-[#F7F6F3] border border-gray-200 rounded-xl text-[#1C1B18] placeholder-[#6B6860] focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] focus:border-transparent transition-shadow"
        />

        {/* Controls row */}
        <div className="flex gap-2 items-center flex-wrap">
          {/* Client select */}
          {clientOptions.length > 0 && (
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="px-2 py-1.5 text-xs bg-[#F7F6F3] border border-gray-200 rounded-lg text-[#1C1B18] focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] max-w-[140px]"
            >
              {clientOptions.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}

          {/* Project select */}
          {projectOptions.length > 0 && (
            <select
              value={projectId ?? ''}
              onChange={e => setProjectId(e.target.value || null)}
              className="px-2 py-1.5 text-xs bg-[#F7F6F3] border border-gray-200 rounded-lg text-[#1C1B18] focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] max-w-[140px]"
            >
              <option value="">No project</option>
              {projectOptions.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}

          {/* Priority */}
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
            className="px-2 py-1.5 text-xs bg-[#F7F6F3] border border-gray-200 rounded-lg text-[#1C1B18] focus:outline-none focus:ring-2 focus:ring-[#4F7BF7]"
          >
            {PRIORITY_OPTIONS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Due date */}
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="px-2 py-1.5 text-xs bg-[#F7F6F3] border border-gray-200 rounded-lg text-[#1C1B18] focus:outline-none focus:ring-2 focus:ring-[#4F7BF7]"
          />

          {/* Recurrence */}
          <select
            value={recurrence}
            onChange={e => setRecurrence(e.target.value as Recurrence)}
            className="px-2 py-1.5 text-xs bg-[#F7F6F3] border border-gray-200 rounded-lg text-[#1C1B18] focus:outline-none focus:ring-2 focus:ring-[#4F7BF7]"
          >
            {RECURRENCE_OPTIONS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          {/* Add button — pushed to right */}
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !clientId || adding}
            className="ml-auto px-4 py-1.5 text-sm font-medium bg-[#4F7BF7] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            {adding ? '…' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
