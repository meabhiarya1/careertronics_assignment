import { cardSurface } from '../../styles/classNames.js';
import { cn } from '../../utils/cn.js';

const TONES = {
  indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  sky: 'bg-sky-50 text-sky-600 ring-sky-100',
  violet: 'bg-violet-50 text-violet-600 ring-violet-100',
};

export function StatCard({ label, value, hint, icon: Icon, tone = 'indigo', isLoading }) {
  return (
    <div className={cn(cardSurface, 'p-5')}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          {isLoading ? (
            <div className="mt-2.5 h-8 w-20 animate-pulse rounded-md bg-slate-100" />
          ) : (
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {value ?? '—'}
            </p>
          )}
        </div>
        <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset', TONES[tone])}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{hint}</p>
    </div>
  );
}
