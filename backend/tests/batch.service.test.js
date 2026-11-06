import { BATCH_LIST_DEFAULTS } from '../src/constants/batch.constants.js';
import { BatchRepository } from '../src/repositories/batch.repository.js';
import { BatchService } from '../src/services/batch.service.js';
import { ApiError } from '../src/utils/ApiError.js';
import { batchesFixture } from './fixtures/batches.fixture.js';

const buildQuery = (overrides = {}) => ({ ...BATCH_LIST_DEFAULTS, ...overrides });
const idsOf = (items) => items.map((batch) => batch.id);

describe('BatchService', () => {
  let service;

  beforeEach(() => {
    service = new BatchService(new BatchRepository(batchesFixture));
  });

  describe('listBatches', () => {
    it('returns the first page sorted by start date (newest first) by default', async () => {
      const { items, pagination } = await service.listBatches(buildQuery());

      expect(idsOf(items)).toEqual([4, 5, 3, 2, 1]);
      expect(pagination).toEqual({
        page: 1,
        limit: 10,
        total: 5,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    });

    it('searches case-insensitively across code, name, course and instructor', async () => {
      const byInstructor = await service.listBatches(buildQuery({ search: 'ANANYA' }));
      const byCode = await service.listBatches(buildQuery({ search: 'dsc-2603' }));

      expect(idsOf(byInstructor.items).sort()).toEqual([1, 4]);
      expect(idsOf(byCode.items)).toEqual([2]);
    });

    it('filters by status and mode, combined with search', async () => {
      const { items, pagination } = await service.listBatches(
        buildQuery({ search: 'full stack', status: 'completed', mode: 'online' }),
      );

      expect(idsOf(items)).toEqual([1]);
      expect(pagination.total).toBe(1);
    });

    it('paginates results and reports navigation flags', async () => {
      const query = buildQuery({ sortBy: 'batchCode', order: 'asc', limit: 2 });

      const first = await service.listBatches({ ...query, page: 1 });
      const middle = await service.listBatches({ ...query, page: 2 });
      const last = await service.listBatches({ ...query, page: 3 });

      expect(idsOf(first.items)).toEqual([5, 2]);
      expect(first.pagination).toMatchObject({ totalPages: 3, hasPrevPage: false, hasNextPage: true });
      expect(idsOf(middle.items)).toEqual([1, 3]);
      expect(middle.pagination).toMatchObject({ hasPrevPage: true, hasNextPage: true });
      expect(idsOf(last.items)).toEqual([4]);
      expect(last.pagination).toMatchObject({ hasPrevPage: true, hasNextPage: false });
    });

    it('returns an empty page when page exceeds the total pages', async () => {
      const { items, pagination } = await service.listBatches(buildQuery({ page: 99 }));

      expect(items).toEqual([]);
      expect(pagination).toMatchObject({ total: 5, totalPages: 1, hasNextPage: false });
    });

    it('sorts numeric fields numerically and breaks ties by id for stable paging', async () => {
      const { items } = await service.listBatches(buildQuery({ sortBy: 'enrolled', order: 'desc' }));

      // enrolled: 45, 38, 30 (id 2), 30 (id 5), 18
      expect(idsOf(items)).toEqual([1, 3, 2, 5, 4]);
    });

    it('returns zero results (not an error) when nothing matches', async () => {
      const { items, pagination } = await service.listBatches(buildQuery({ search: 'kotlin' }));

      expect(items).toEqual([]);
      expect(pagination).toMatchObject({ total: 0, totalPages: 0 });
    });
  });

  describe('getBatchById', () => {
    it('returns the matching batch', async () => {
      await expect(service.getBatchById(3)).resolves.toMatchObject({ batchCode: 'FSD-2609-02' });
    });

    it('throws a 404 ApiError when the batch does not exist', async () => {
      const error = await service.getBatchById(999).catch((err) => err);

      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(404);
    });
  });

  describe('getStats', () => {
    it('aggregates totals and includes every status key', async () => {
      await expect(service.getStats()).resolves.toEqual({
        totalBatches: 5,
        totalEnrolled: 161,
        byStatus: { upcoming: 1, ongoing: 1, completed: 2, cancelled: 1 },
      });
    });
  });
});
