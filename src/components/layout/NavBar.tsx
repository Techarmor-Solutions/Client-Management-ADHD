import type { AppView } from '../../types';

interface NavBarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onSignOut: () => void;
}

const NAV_ITEMS: { view: AppView; label: string; icon: string }[] = [
  { view: 'tasks',   label: 'Tasks',         icon: '✓' },
  { view: 'clients', label: 'Clients',        icon: '👥' },
  { view: 'planner', label: 'Planner',        icon: '🗓' },
  { view: 'review',  label: 'Weekly Review',  icon: '📅' },
];

export function NavBar({ currentView, onViewChange, onSignOut }: NavBarProps) {
  const effectiveView = currentView === 'client-detail' ? 'clients' : currentView;

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 flex items-center h-14">
        {/* Logo */}
        <span className="text-base font-bold text-[#1C1B18] mr-6 hidden sm:block">
          📋 Client Manager
        </span>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1">
          {NAV_ITEMS.map(({ view, label, icon }) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-touch flex items-center gap-1.5 ${
                effectiveView === view
                  ? 'bg-[#4F7BF7] text-white'
                  : 'text-[#6B6860] hover:text-[#1C1B18] hover:bg-gray-100'
              }`}
            >
              <span className="text-xs">{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={onSignOut}
          className="text-xs text-[#6B6860] hover:text-[#1C1B18] px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors min-touch"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
