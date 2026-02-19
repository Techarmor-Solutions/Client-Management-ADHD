import { resolveColor } from '../../utils/colorUtils';

interface ColorDotProps {
  color: string;
  size?: 'sm' | 'md';
}

export function ColorDot({ color, size = 'md' }: ColorDotProps) {
  const sizeClass = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';
  return (
    <span
      className={`inline-block rounded-full flex-shrink-0 ${sizeClass}`}
      style={{ backgroundColor: resolveColor(color) }}
    />
  );
}
