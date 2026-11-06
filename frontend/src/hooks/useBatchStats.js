import { batchApiService } from '../services/batchApiService.js';
import { useAsync } from './useAsync.js';

const fetchStats = (signal) => batchApiService.getStats({ signal });

export function useBatchStats() {
  const { data, error, isLoading } = useAsync(fetchStats, 'batch-stats');
  return { stats: data, error, isLoading };
}
