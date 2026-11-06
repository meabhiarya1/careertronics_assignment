import { cn } from '../../utils/cn.js';

const TONES = {
  neutral: 'bg-slate-100 text-slate-500 ring-slate-50',
  danger: 'bg-rose-100 text-rose-600 ring-rose-50',
};

/** Centered icon + message + optional action, used for empty and error states. */
export function EmptyState({ icon: Icon, title, description, action, tone = 'neutral' }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className={cn('flex size-12 items-center justify-center rounded-2xl ring-8', TONES[tone])}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-sm font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
