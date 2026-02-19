import { useState } from 'react';
import type { Client, Task, NewTask } from '../../types';
import { Button } from '../shared/Button';
import { ColorDot } from '../shared/ColorDot';
import { StatusBadge } from '../shared/Badge';
import { todayString } from '../../utils/dateUtils';

interface ReviewStep2ClientsProps {
  clients: Client[];
  tasks: Task[];
  onAddTask: (task: NewTask) => Promise<unknown>;
  onNext: () => void;
}

export function ReviewStep2Clients({ clients, tasks, onAddTask, onNext }: ReviewStep2ClientsProps) {
  const [clientIndex, setClientIndex] = useState(0);
  const [quickTitle, setQuickTitle] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  const activeClients = clients.filter(c => c.status === 'active');

  if (activeClients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#6B6860] mb-4">No active clients to review.</p>
        <Button onClick={onNext}>Continue →</Button>
      </div>
    );
  }

  const client = activeClients[clientIndex];
  const today = todayString();
  const clientTasks = tasks.filter(t => t.client_id === client.id && !t.done);
  const overdueCount = clientTasks.filter(t => t.due_date && t.due_date < today).length;
  const isLast = clientIndex === activeClients.length - 1;

  const handleQuickAdd = async () => {
    if (!quickTitle.trim()) return;
    setAddingTask(true);
    await onAddTask({ title: quickTitle.trim(), client_id: client.id, priority: 'medium' });
    setQuickTitle('');
    setAddingTask(false);
  };

  const handleNext = () => {
    if (isLast) {
      onNext();
    } else {
      setClientIndex(i => i + 1);
      setQuickTitle('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-[#6B6860] mb-1">
            Client {clientIndex + 1} of {activeClients.length}
          </p>
          <h2 className="text-xl font-bold text-[#1C1B18]">How's this going?</h2>
        </div>
        <div className="flex gap-1">
          {activeClients.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i === clientIndex ? 'bg-[#4F7BF7]' : i < clientIndex ? 'bg-blue-200' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Client card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <ColorDot color={client.color} />
          <h3 className="text-base font-semibold text-[#1C1B18]">{client.name}</h3>
          <StatusBadge status={client.status} />
        </div>

        <div className="flex gap-4 text-sm text-[#6B6860]">
          <span>{clientTasks.length} open tasks</span>
          {overdueCount > 0 && (
            <span className="text-red-600 font-medium">⚠ {overdueCount} overdue</span>
          )}
          {client.monthly_revenue > 0 && (
            <span>${client.monthly_revenue.toLocaleString()}/mo</span>
          )}
        </div>
      </div>

      {/* Quick add task */}
      <div className="mb-5">
        <p className="text-sm font-medium text-[#1C1B18] mb-2">Anything to add for this client?</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={quickTitle}
            onChange={e => setQuickTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleQuickAdd()}
            placeholder="Quick task…"
            className="flex-1 px-3 py-2 text-sm bg-[#F7F6F3] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] min-touch"
          />
          <Button
            size="sm"
            onClick={handleQuickAdd}
            disabled={!quickTitle.trim() || addingTask}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <Button className="w-full justify-center" onClick={handleNext}>
        {isLast ? 'Done reviewing clients →' : `Next Client → ${activeClients[clientIndex + 1]?.name ?? ''}`}
      </Button>
    </div>
  );
}
