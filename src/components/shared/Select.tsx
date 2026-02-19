import { type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[#1C1B18]">{label}</label>}
      <select
        className={`w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-[#1C1B18] focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] focus:border-transparent transition-shadow min-touch ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
