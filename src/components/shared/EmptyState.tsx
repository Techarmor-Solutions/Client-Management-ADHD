interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-[#1C1B18] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#6B6860] max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}
