import { useState, useRef, useEffect } from 'react';
import type { Note } from '../../types';
import { formatDateTime } from '../../utils/dateUtils';

interface NotesViewProps {
  notes: Note[];
  loading: boolean;
  onAdd: (content: string) => Promise<Note | null>;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export function NotesView({ notes, loading, onAdd, onUpdate, onDelete }: NotesViewProps) {
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [search, setSearch] = useState('');
  const captureRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus capture on mount
  useEffect(() => {
    captureRef.current?.focus();
  }, []);

  const handleSave = async () => {
    const text = draft.trim();
    if (!text) return;
    setSaving(true);
    setSaveError(false);
    const result = await onAdd(text);
    setSaving(false);
    if (result) {
      setDraft('');
      captureRef.current?.focus();
    } else {
      setSaveError(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl+Enter to save
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleStartEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: string) => {
    const text = editContent.trim();
    if (text) onUpdate(id, text);
    setEditingId(null);
  };

  const handleCancelEdit = () => setEditingId(null);

  const filtered = search.trim()
    ? notes.filter(n => n.content.toLowerCase().includes(search.toLowerCase()))
    : notes;

  return (
    <div className="flex flex-col flex-1 overflow-hidden max-w-2xl mx-auto w-full px-4 py-4">
      {/* Quick capture */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5">
        <textarea
          ref={captureRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Capture a thought… (⌘+Enter to save)"
          rows={3}
          className="w-full px-4 pt-3 pb-2 text-sm text-[#1C1B18] placeholder-[#9E9D98] resize-none focus:outline-none rounded-xl"
        />
        <div className="flex items-center justify-between px-4 pb-3">
          <span className="text-xs text-[#9E9D98]">{draft.length > 0 ? `${draft.length} chars` : ''}</span>
          <div className="flex items-center gap-2">
            {saveError && (
              <span className="text-xs text-red-600">Failed to save — check console</span>
            )}
            <button
              onClick={handleSave}
              disabled={!draft.trim() || saving}
              className="px-4 py-1.5 text-sm font-medium bg-[#4F7BF7] text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3d6ae0] transition-colors"
            >
              {saving ? 'Saving…' : 'Save note'}
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      {notes.length > 2 && (
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes…"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] focus:border-transparent bg-white"
          />
        </div>
      )}

      {/* Notes list */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-[#6B6860] text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
          {search ? (
            <>
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm text-[#6B6860]">No notes match "{search}"</p>
            </>
          ) : (
            <>
              <p className="text-2xl mb-2">📝</p>
              <p className="text-sm text-[#6B6860]">No notes yet — capture your first thought above.</p>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto pb-4">
          {filtered.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              isEditing={editingId === note.id}
              editContent={editContent}
              onEditContentChange={setEditContent}
              onStartEdit={() => handleStartEdit(note)}
              onSaveEdit={() => handleSaveEdit(note.id)}
              onCancelEdit={handleCancelEdit}
              onDelete={() => onDelete(note.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  isEditing: boolean;
  editContent: string;
  onEditContentChange: (v: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}

function NoteCard({ note, isEditing, editContent, onEditContentChange, onStartEdit, onSaveEdit, onCancelEdit, onDelete }: NoteCardProps) {
  const editRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) editRef.current?.focus();
  }, [isEditing]);

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onSaveEdit(); }
    if (e.key === 'Escape') onCancelEdit();
  };

  // First line or first 60 chars as a title preview when collapsed
  const lines = note.content.split('\n');
  const firstLine = lines[0].trim();
  const rest = note.content.slice(firstLine.length).trim();
  const wasEdited = note.updated_at !== note.created_at;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm group">
      {isEditing ? (
        <div className="p-4 flex flex-col gap-3">
          <textarea
            ref={editRef}
            value={editContent}
            onChange={e => onEditContentChange(e.target.value)}
            onKeyDown={handleEditKeyDown}
            rows={Math.max(3, editContent.split('\n').length + 1)}
            className="w-full text-sm text-[#1C1B18] resize-none focus:outline-none"
          />
          <div className="flex items-center gap-2 justify-end">
            <button onClick={onCancelEdit} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-[#6B6860] hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={onSaveEdit} className="text-xs px-3 py-1.5 rounded-lg bg-[#4F7BF7] text-white hover:bg-[#3d6ae0] transition-colors">Save</button>
          </div>
        </div>
      ) : (
        <div className="p-4" onClick={onStartEdit} role="button" style={{ cursor: 'text' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {firstLine && (
                <p className="text-sm font-medium text-[#1C1B18] break-words">{firstLine}</p>
              )}
              {rest && (
                <p className="text-sm text-[#6B6860] mt-1 whitespace-pre-wrap break-words">{rest}</p>
              )}
            </div>

            {/* Actions — visible on hover */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={e => { e.stopPropagation(); onStartEdit(); }}
                className="p-1.5 rounded-lg text-[#6B6860] hover:text-[#1C1B18] hover:bg-gray-100 transition-colors"
                aria-label="Edit note"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); if (confirm('Delete this note?')) onDelete(); }}
                className="p-1.5 rounded-lg text-[#6B6860] hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Delete note"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.5h6.6L11 3.5H3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-[#9E9D98] mt-2">
            {formatDateTime(note.created_at)}
            {wasEdited && ' · edited'}
          </p>
        </div>
      )}
    </div>
  );
}
