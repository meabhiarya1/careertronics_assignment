import { STATUS_FILTER_OPTIONS } from '../../constants/batch.js';
import { focusRing } from '../../styles/classNames.js';
import { cn } from '../../utils/cn.js';

/**
 * Segmented status filter. Counts come from /batches/stats (overall totals,
 * independent of the search box) and are hidden until stats load.
 */
export function StatusTabs({ value, onChange, stats }) {
  const getCount = (status) => (status ? stats?.byStatus[status] : stats?.totalBatches);

  return (
    <div
      role="group"
      aria-label="Filter by status"
      className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100/80 p-1 sm:self-start xl:shrink-0"
    >
      {STATUS_FILTER_OPTIONS.map((option) => {
        const isActive = option.value === value;
        const count = getCount(option.value);

        return (
          <button
            key={option.value || 'all'}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
              focusRing,
              isActive
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5'
                : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {option.label}
            {count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-px text-xs tabular-nums',
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200/70 text-slate-500',
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
