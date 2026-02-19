interface WhatsNextButtonProps {
  onClick: () => void;
}

export function WhatsNextButton({ onClick }: WhatsNextButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-[#4F7BF7] text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors min-touch shadow-sm"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      What's Next?
    </button>
  );
}
