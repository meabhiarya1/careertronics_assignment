import { BATCH_STATUS_META } from '../../constants/batch.js';
import { cn } from '../../utils/cn.js';

const FALLBACK_META = {
  badgeClass: 'bg-slate-100 text-slate-600 ring-slate-500/15',
  dotClass: 'bg-slate-400',
};

export function StatusBadge({ status }) {
  const meta = BATCH_STATUS_META[status] ?? { ...FALLBACK_META, label: status };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        meta.badgeClass,
      )}
    >
      <span className="relative flex size-1.5">
        {status === 'ongoing' && (
          <span className={cn('absolute inline-flex size-full animate-ping rounded-full opacity-60', meta.dotClass)} />
        )}
        <span className={cn('relative inline-flex size-1.5 rounded-full', meta.dotClass)} />
      </span>
      {meta.label}
    </span>
  );
}
