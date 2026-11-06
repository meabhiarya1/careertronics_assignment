import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { PAGE_SIZE } from '../constants/batchConstants.js';
import { getErrorMessage } from '../services/apiClient.js';
import { batchService } from '../services/batchService.js';

// Fetches batches from the API whenever search, filters or page change.
export function useBatches({ search, status, centre, page }) {
  const [batches, setBatches] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Cancels this request if the inputs change before it finishes,
    // so an old response can never overwrite a newer one.
    const controller = new AbortController();

    async function loadBatches() {
      setIsLoading(true);
      setError('');

      try {
        const result = await batchService.getBatches(
          { search, status, centre, page, limit: PAGE_SIZE },
          controller.signal,
        );
        setBatches(result.data);
        setPagination(result.pagination);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setBatches([]);
        setPagination(null);
        setError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadBatches();

    return () => controller.abort();
  }, [search, status, centre, page, retryCount]);

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);

  return { batches, pagination, isLoading, error, retry };
}
