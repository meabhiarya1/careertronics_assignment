import { Building2, Globe, Shuffle } from 'lucide-react';
import { BATCH_MODE_LABELS } from '../../constants/batch.js';

const MODE_ICONS = {
  online: Globe,
  offline: Building2,
  hybrid: Shuffle,
};

export function ModeBadge({ mode }) {
  const Icon = MODE_ICONS[mode] ?? Globe;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 ring-inset">
      <Icon className="size-3.5 text-slate-400" aria-hidden="true" />
      {BATCH_MODE_LABELS[mode] ?? mode}
    </span>
  );
}
