import { useCallback, useMemo } from 'react';
import { DEFAULT_BATCH_QUERY } from '../constants/batch.js';
import { parseBatchQuery, serializeBatchQuery } from '../utils/batchQuery.js';
import { useUrlState } from './useUrlState.js';

const isSubsetOf = (patch, state) => Object.entries(patch).every(([key, value]) => state[key] === value);

/**
 * Single source of truth for the list view (search, filters, sort, page),
 * synced to the URL. Encodes the paging rules in one place:
 * any change to what's being listed resets to page 1.
 */
export function useBatchQuery() {
  const [query, setQuery] = useUrlState(parseBatchQuery, serializeBatchQuery);

  const updateFilters = useCallback(
    (patch) => setQuery((prev) => (isSubsetOf(patch, prev) ? prev : { ...prev, ...patch, page: 1 })),
    [setQuery],
  );

  const setPage = useCallback((page) => setQuery((prev) => ({ ...prev, page })), [setQuery]);

  const setPageSize = useCallback(
    (limit) => setQuery((prev) => ({ ...prev, limit, page: 1 })),
    [setQuery],
  );

  const toggleSort = useCallback(
    (field, defaultOrder = 'asc') =>
      setQuery((prev) => {
        const order = prev.sortBy === field ? (prev.order === 'asc' ? 'desc' : 'asc') : defaultOrder;
        return { ...prev, sortBy: field, order, page: 1 };
      }),
    [setQuery],
  );

  /** Clears search + filters but keeps the user's sort and page size. */
  const resetFilters = useCallback(
    () =>
      setQuery((prev) => ({
        ...DEFAULT_BATCH_QUERY,
        sortBy: prev.sortBy,
        order: prev.order,
        limit: prev.limit,
      })),
    [setQuery],
  );

  return useMemo(
    () => ({ query, updateFilters, setPage, setPageSize, toggleSort, resetFilters }),
    [query, updateFilters, setPage, setPageSize, toggleSort, resetFilters],
  );
}
