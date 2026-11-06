import { cn } from '../../utils/cn.js';
import { getInitials } from '../../utils/format.js';

const TONES = [
  'bg-indigo-100 text-indigo-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-teal-100 text-teal-700',
];

// Same name -> same colour on every render and every page.
const hashString = (value) =>
  [...value].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);

export function Avatar({ name, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
        TONES[hashString(name) % TONES.length],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
