import { apiClient } from './apiClient.js';

// All batch-related API calls live here, so components never call axios directly.
export class BatchService {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  // Returns { success, data, pagination } from GET /api/batches
  async getBatches({ search, status, centre, page, limit }, signal) {
    const response = await this.httpClient.get('/batches', {
      params: { search, status, centre, page, limit },
      signal,
    });
    return response.data;
  }

  // Returns a list of centre names from GET /api/batches/centres
  async getCentres(signal) {
    const response = await this.httpClient.get('/batches/centres', { signal });
    return response.data.data;
  }
}

export const batchService = new BatchService(apiClient);
