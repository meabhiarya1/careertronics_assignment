export const BATCH_STATUS_META = Object.freeze({
  upcoming: {
    label: 'Upcoming',
    badgeClass: 'bg-sky-50 text-sky-700 ring-sky-600/15',
    dotClass: 'bg-sky-500',
  },
  ongoing: {
    label: 'Ongoing',
    badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
    dotClass: 'bg-emerald-500',
  },
  completed: {
    label: 'Completed',
    badgeClass: 'bg-slate-100 text-slate-600 ring-slate-500/15',
    dotClass: 'bg-slate-400',
  },
  cancelled: {
    label: 'Cancelled',
    badgeClass: 'bg-rose-50 text-rose-700 ring-rose-600/15',
    dotClass: 'bg-rose-500',
  },
});

export const BATCH_MODE_LABELS = Object.freeze({
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Hybrid',
});

export const STATUS_FILTER_OPTIONS = Object.freeze([
  { value: '', label: 'All' },
  ...Object.entries(BATCH_STATUS_META).map(([value, { label }]) => ({ value, label })),
]);

export const MODE_FILTER_OPTIONS = Object.freeze([
  { value: '', label: 'All modes' },
  ...Object.entries(BATCH_MODE_LABELS).map(([value, label]) => ({ value, label })),
]);

export const SORT_FIELDS = Object.freeze(['batchCode', 'batchName', 'startDate', 'endDate', 'enrolled']);
export const SORT_ORDERS = Object.freeze(['asc', 'desc']);

export const PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 50]);

export const SEARCH_MAX_LENGTH = 100;

/** Query state used when the URL has no params. Mirrors the API defaults. */
export const DEFAULT_BATCH_QUERY = Object.freeze({
  search: '',
  status: '',
  mode: '',
  sortBy: 'startDate',
  order: 'desc',
  page: 1,
  limit: 10,
});
