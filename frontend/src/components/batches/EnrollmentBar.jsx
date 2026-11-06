import { cn } from '../../utils/cn.js';

const getFillTone = (percent) => {
  if (percent >= 90) return 'bg-emerald-500';
  if (percent >= 60) return 'bg-indigo-500';
  return 'bg-amber-400';
};

export function EnrollmentBar({ enrolled, capacity }) {
  const percent = capacity > 0 ? Math.min(100, Math.round((enrolled / capacity) * 100)) : 0;

  return (
    <div className="w-36">
      <div className="flex items-baseline justify-between text-xs tabular-nums">
        <span className="font-medium text-slate-900">
          {enrolled}
          <span className="font-normal text-slate-400"> / {capacity}</span>
        </span>
        <span className="text-slate-500">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Seats filled"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={enrolled}
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"
      >
        <div className={cn('h-full rounded-full', getFillTone(percent))} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
