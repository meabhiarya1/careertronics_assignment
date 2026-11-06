import { CalendarDays, Layers3 } from 'lucide-react';

const todayLabel = new Intl.DateTimeFormat('en-IN', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format(new Date());

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25">
            <Layers3 className="size-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Batch Ops</p>
            <p className="text-xs text-slate-500">Operations console</p>
          </div>
        </div>

        <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-xs sm:inline-flex">
          <CalendarDays className="size-3.5 text-slate-400" aria-hidden="true" />
          {todayLabel}
        </span>
      </div>
    </header>
  );
}
