import {
  BATCH_MODE_LABELS,
  BATCH_STATUS_META,
  DEFAULT_BATCH_QUERY,
  PAGE_SIZE_OPTIONS,
  SEARCH_MAX_LENGTH,
  SORT_FIELDS,
  SORT_ORDERS,
} from '../constants/batch.js';

const STATUS_VALUES = Object.keys(BATCH_STATUS_META);
const MODE_VALUES = Object.keys(BATCH_MODE_LABELS);

/**
 * Reads the batch query from URL search params. Anything missing or invalid
 * (e.g. a hand-edited URL) falls back to its default instead of erroring.
 *
 * @param {URLSearchParams} params
 */
export function parseBatchQuery(params) {
  const oneOf = (key, allowed) => {
    const value = params.get(key);
    return allowed.includes(value) ? value : DEFAULT_BATCH_QUERY[key];
  };

  const page = Number(params.get('page'));
  const limit = Number(params.get('limit'));

  return {
    search: (params.get('search') ?? '').trim().slice(0, SEARCH_MAX_LENGTH),
    status: oneOf('status', STATUS_VALUES),
    mode: oneOf('mode', MODE_VALUES),
    sortBy: oneOf('sortBy', SORT_FIELDS),
    order: oneOf('order', SORT_ORDERS),
    page: Number.isInteger(page) && page > 0 ? page : DEFAULT_BATCH_QUERY.page,
    limit: PAGE_SIZE_OPTIONS.includes(limit) ? limit : DEFAULT_BATCH_QUERY.limit,
  };
}

/** Writes only non-default values, keeping shareable URLs short. */
export function serializeBatchQuery(query) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== '' && value !== DEFAULT_BATCH_QUERY[key]) {
      params.set(key, String(value));
    }
  }
  return params;
}

export const hasActiveFilters = ({ search, status, mode }) => Boolean(search || status || mode);
