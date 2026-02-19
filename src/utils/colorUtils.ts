/** Maps legacy named colors (stored before hex migration) to their hex equivalents */
const LEGACY_COLOR_MAP: Record<string, string> = {
  slate:  '#94A3B8',
  violet: '#8B5CF6',
  blue:   '#3B82F6',
  teal:   '#14B8A6',
  amber:  '#F59E0B',
  rose:   '#F43F5E',
};

/** Returns a valid CSS hex color string. Handles legacy named colors gracefully. */
export function resolveColor(color: string): string {
  if (color.startsWith('#')) return color;
  return LEGACY_COLOR_MAP[color] ?? '#94A3B8';
}
