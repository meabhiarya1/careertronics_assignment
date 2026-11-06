import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { focusRing } from '../../styles/classNames.js';
import { cn } from '../../utils/cn.js';

const ARIA_SORT = { asc: 'ascending', desc: 'descending' };

export function SortableHeader({ label, field, defaultOrder, sortBy, order, onSort, className }) {
  const isActive = sortBy === field;
  const Icon = !isActive ? ChevronsUpDown : order === 'asc' ? ArrowUp : ArrowDown;

  return (
    <th scope="col" aria-sort={isActive ? ARIA_SORT[order] : 'none'} className={className}>
      <button
        type="button"
        onClick={() => onSort(field, defaultOrder)}
        className={cn(
          'group -mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 uppercase transition-colors',
          'hover:text-slate-900',
          isActive && 'text-slate-900',
          focusRing,
        )}
      >
        {label}
        <Icon
          aria-hidden="true"
          className={cn(
            'size-3.5 transition-colors',
            isActive ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-500',
          )}
        />
      </button>
    </th>
  );
}
