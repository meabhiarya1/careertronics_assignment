import { BATCH_STATUS } from '../constants/batch.constants.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Business logic for batches: turns validated request input into repository
 * queries and shapes the results (pagination metadata, stats).
 */
export class BatchService {
  #batchRepository;

  constructor(batchRepository) {
    this.#batchRepository = batchRepository;
  }

  /**
   * @param {object} query  Validated list query (see batch.validator.js)
   */
  async listBatches({ search, status, mode, sortBy, order, page, limit }) {
    const { items, total } = await this.#batchRepository.findMany({
      filters: { search, status, mode },
      sort: { field: sortBy, order },
      offset: (page - 1) * limit,
      limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getBatchById(id) {
    const batch = await this.#batchRepository.findById(id);
    if (!batch) {
      throw ApiError.notFound(`Batch with id ${id} not found`);
    }
    return batch;
  }

  async getStats() {
    const { total, totalEnrolled, byStatus } = await this.#batchRepository.getSummary();

    // Always return every status so clients don't need to handle missing keys.
    const countsByStatus = Object.fromEntries(
      Object.values(BATCH_STATUS).map((status) => [status, byStatus[status] ?? 0]),
    );

    return { totalBatches: total, totalEnrolled, byStatus: countsByStatus };
  }
}
