import { httpClient } from '../api/httpClient.js';

/** Batch endpoints. Unwraps the API envelope so callers get plain data. */
export class BatchApiService {
  #http;

  constructor(http) {
    this.#http = http;
  }

  /**
   * @param {{ search?: string, status?: string, mode?: string, sortBy?: string,
   *           order?: 'asc' | 'desc', page?: number, limit?: number }} query
   * @param {{ signal?: AbortSignal }} [options]
   * @returns {Promise<{ items: object[], meta: object }>}
   */
  async getBatches(query, { signal } = {}) {
    const { data, meta } = await this.#http.get('/batches', { params: query, signal });
    return { items: data, meta };
  }

  /** @returns {Promise<{ totalBatches: number, totalEnrolled: number, byStatus: Record<string, number> }>} */
  async getStats({ signal } = {}) {
    const { data } = await this.#http.get('/batches/stats', { signal });
    return data;
  }
}

export const batchApiService = new BatchApiService(httpClient);
