import type { Client } from '../../types';
import { ColorDot } from '../shared/ColorDot';
import { StatusBadge } from '../shared/Badge';

interface ClientCardProps {
  client: Client;
  taskCount: number;
  overdueCount: number;
  onClick: () => void;
  onEdit: () => void;
}

export function ClientCard({ client, taskCount, overdueCount, onClick, onEdit }: ClientCardProps) {
  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <ColorDot color={client.color} />
          <h3 className="text-sm font-semibold text-[#1C1B18] truncate">{client.name}</h3>
        </div>

        <button
          onClick={e => { e.stopPropagation(); onEdit(); }}
          className="text-[#6B6860] hover:text-[#1C1B18] hover:bg-gray-100 rounded-lg p-1.5 transition-colors flex-shrink-0 min-touch"
          aria-label="Edit client"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <StatusBadge status={client.status} />

        <span className="text-xs text-[#6B6860]">
          {client.contract_type === 'retainer' ? 'Retainer' : 'Project-based'}
        </span>

        {client.monthly_revenue > 0 && (
          <span className="text-xs font-medium text-[#1C1B18]">
            ${client.monthly_revenue.toLocaleString()}/mo
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-[#6B6860]">
          {taskCount} pending {taskCount === 1 ? 'task' : 'tasks'}
        </span>
        {overdueCount > 0 && (
          <span className="text-xs font-semibold text-red-600">
            ⚠ {overdueCount} overdue
          </span>
        )}
      </div>
    </div>
  );
}
