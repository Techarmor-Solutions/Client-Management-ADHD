import { useState } from 'react';
import type { Project, NewProject, ProjectStatus } from '../../types';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { PROJECT_STATUS_OPTIONS } from '../../constants';
import { formatDate } from '../../utils/dateUtils';

interface ProjectSectionProps {
  clientId: string;
  projects: Project[];
  onAdd: (project: NewProject) => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
}

export function ProjectSection({ clientId, projects, onAdd, onUpdate, onDelete }: ProjectSectionProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const clientProjects = projects.filter(p => p.client_id === clientId);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd({ client_id: clientId, name: newName.trim(), due_date: newDueDate || null });
    setNewName('');
    setNewDueDate('');
    setShowAdd(false);
  };

  const statusColors: Record<ProjectStatus, string> = {
    active:   'bg-blue-100 text-blue-700',
    complete: 'bg-green-100 text-green-700',
    paused:   'bg-yellow-100 text-yellow-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#1C1B18]">Projects</h3>
        <Button size="sm" variant="secondary" onClick={() => setShowAdd(v => !v)}>
          + Project
        </Button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-[#F7F6F3] rounded-xl p-3 mb-3 flex gap-2 items-end flex-wrap">
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Project name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
          </div>
          <Input
            type="date"
            value={newDueDate}
            onChange={e => setNewDueDate(e.target.value)}
            className="w-36"
          />
          <Button size="sm" onClick={handleAdd} disabled={!newName.trim()}>Add</Button>
          <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
        </div>
      )}

      {clientProjects.length === 0 && !showAdd && (
        <p className="text-sm text-[#6B6860] py-2">No projects yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {clientProjects.map(project => (
          <div key={project.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2">
            {editingId === project.id ? (
              // Inline edit
              <div className="flex-1 flex gap-2 items-center flex-wrap">
                <input
                  className="flex-1 text-sm px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7BF7]"
                  defaultValue={project.name}
                  onBlur={e => {
                    if (e.target.value.trim()) onUpdate(project.id, { name: e.target.value.trim() });
                    setEditingId(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  autoFocus
                />
                <select
                  defaultValue={project.status}
                  onChange={e => onUpdate(project.id, { status: e.target.value as ProjectStatus })}
                  className="text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none"
                >
                  {PROJECT_STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="text-sm text-[#1C1B18] truncate">{project.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${statusColors[project.status]}`}>
                  {project.status}
                </span>
                {project.due_date && (
                  <span className="text-xs text-[#6B6860]">{formatDate(project.due_date)}</span>
                )}
              </div>
            )}

            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => setEditingId(editingId === project.id ? null : project.id)}
                className="text-[#6B6860] hover:text-[#1C1B18] rounded p-1 hover:bg-gray-100 min-touch"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => { if (confirm('Delete this project?')) onDelete(project.id); }}
                className="text-[#6B6860] hover:text-red-600 rounded p-1 hover:bg-red-50 min-touch"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5h6.6L11 3.5H3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
