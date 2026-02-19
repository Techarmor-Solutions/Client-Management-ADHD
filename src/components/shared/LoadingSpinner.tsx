export function LoadingSpinner({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-8 h-8 border-2 border-[#4F7BF7] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#6B6860]">{message}</p>
    </div>
  );
}
