import { useState } from 'react';
import type { Task, Client, Project, Priority, Recurrence, TaskStatus } from '../../types';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Select } from '../shared/Select';
import { PRIORITY_OPTIONS, RECURRENCE_OPTIONS, TASK_STATUS_OPTIONS } from '../../constants';
import { useTaskNotes } from '../../hooks/useTaskNotes';
import { formatDateTime } from '../../utils/dateUtils';

interface TaskEditModalProps {
  task: Task;
  clients: Client[];
  projects?: Project[];
  onSave: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function TaskEditModal({ task, clients, projects, onSave, onDelete, onClose }: TaskEditModalProps) {
  const [title, setTitle] = useState(task.title);
  const [clientId, setClientId] = useState(task.client_id);
  const [projectId, setProjectId] = useState<string | null>(task.project_id ?? null);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [recurrence, setRecurrence] = useState<Recurrence>(task.recurrence);
  const [dueDate, setDueDate] = useState(task.due_date ?? '');
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [noteText, setNoteText] = useState('');

  const { notes, addNote } = useTaskNotes(task.id);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(task.id, {
      title: title.trim(),
      client_id: clientId,
      project_id: projectId,
      priority,
      recurrence,
      due_date: dueDate || null,
      status,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await addNote(noteText.trim());
    setNoteText('');
  };

  const clientOptions = clients.map(c => ({ value: c.id, label: c.name }));
  const projectOptions = projects?.filter(p => p.client_id === clientId) ?? [];
  const projectSelectOptions = [
    { value: '', label: 'No project' },
    ...projectOptions.map(p => ({ value: p.id, label: p.name })),
  ];

  return (
    <Modal
      title="Edit Task"
      onClose={onClose}
      footer={
        <>
          <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Select
          label="Status"
          value={status}
          onChange={e => setStatus(e.target.value as TaskStatus)}
          options={TASK_STATUS_OPTIONS}
        />

        <Input
          label="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />

        <Select
          label="Client"
          value={clientId}
          onChange={e => { setClientId(e.target.value); setProjectId(null); }}
          options={clientOptions}
        />

        {projectOptions.length > 0 && (
          <Select
            label="Project"
            value={projectId ?? ''}
            onChange={e => setProjectId(e.target.value || null)}
            options={projectSelectOptions}
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Priority"
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
            options={PRIORITY_OPTIONS}
          />

          <Select
            label="Repeat"
            value={recurrence}
            onChange={e => setRecurrence(e.target.value as Recurrence)}
            options={RECURRENCE_OPTIONS}
          />
        </div>

        <Input
          label="Due date"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium text-[#1C1B18]">Notes</h4>
          <div className="flex gap-2">
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add a note…"
              rows={2}
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] focus:border-transparent"
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddNote();
              }}
            />
            <button
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              className="self-end px-3 py-2 text-sm font-medium bg-[#4F7BF7] text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3d6ae0] transition-colors"
            >
              Add
            </button>
          </div>

          {notes.length > 0 && (
            <div className="flex flex-col gap-2 mt-1 max-h-48 overflow-y-auto">
              {notes.map(note => (
                <div key={note.id} className="bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-xs text-[#6B6860]">{formatDateTime(note.created_at)}</span>
                  <p className="text-sm text-[#1C1B18] mt-0.5 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
