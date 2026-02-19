import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[#1C1B18]">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-[#1C1B18] placeholder-[#6B6860] focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] focus:border-transparent transition-shadow min-touch ${error ? 'border-red-300 focus:ring-red-300' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
);

Input.displayName = 'Input';
