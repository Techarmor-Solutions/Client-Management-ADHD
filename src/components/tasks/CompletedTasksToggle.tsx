interface CompletedTasksToggleProps {
  count: number;
  expanded: boolean;
  onToggle: () => void;
}

export function CompletedTasksToggle({ count, expanded, onToggle }: CompletedTasksToggleProps) {
  if (count === 0) return null;

  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 text-sm text-[#6B6860] hover:text-[#1C1B18] transition-colors py-2 min-touch"
    >
      <svg
        width="14" height="14" viewBox="0 0 14 14" fill="none"
        className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
      >
        <path d="M4.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {expanded ? 'Hide' : 'Show'} {count} completed {count === 1 ? 'task' : 'tasks'}
    </button>
  );
}
