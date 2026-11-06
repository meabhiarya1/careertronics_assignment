import { batchApiService } from '../services/batchApiService.js';
import { useAsync } from './useAsync.js';

/** Fetches a page of batches for the given query; refetches when it changes. */
export function useBatches(query) {
  const { data, error, isLoading, retry } = useAsync(
    (signal) => batchApiService.getBatches(query, { signal }),
    JSON.stringify(query),
  );

  return {
    /** `undefined` until the first successful response. */
    items: data?.items,
    meta: data?.meta,
    error,
    isLoading,
    retry,
  };
}
