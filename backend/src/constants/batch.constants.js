export const BATCH_STATUS = Object.freeze({
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

export const BATCH_MODE = Object.freeze({
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid',
});

/** Fields matched (case-insensitively) by the `search` query param. */
export const SEARCHABLE_FIELDS = Object.freeze(['batchCode', 'batchName', 'course', 'instructor']);

export const SORTABLE_FIELDS = Object.freeze([
  'batchCode',
  'batchName',
  'startDate',
  'endDate',
  'enrolled',
]);

export const SORT_ORDER = Object.freeze({ ASC: 'asc', DESC: 'desc' });

export const BATCH_LIST_DEFAULTS = Object.freeze({
  page: 1,
  limit: 10,
  sortBy: 'startDate',
  order: SORT_ORDER.DESC,
});

export const MAX_PAGE_LIMIT = 100;
export const MAX_SEARCH_LENGTH = 100;
