import { BatchService } from '../services/batchService.js';
import { batchesFixture } from './fixtures/batchesFixture.js';

const defaultQuery = { search: '', status: '', centre: '', page: 1, limit: 5 };
const getCodes = (batches) => batches.map((batch) => batch.batchCode);

describe('BatchService', () => {
  const batchService = new BatchService(batchesFixture);

  describe('getBatches', () => {
    it('returns the first page and pagination info when no filters are applied', () => {
      const result = batchService.getBatches(defaultQuery);

      expect(getCodes(result.data)).toEqual(['B-2401', 'B-2402', 'B-2403', 'B-2404', 'B-2405']);
      expect(result.pagination).toEqual({ page: 1, limit: 5, totalRecords: 7, totalPages: 2 });
    });

    it('searches by batch code (case-insensitive)', () => {
      const result = batchService.getBatches({ ...defaultQuery, search: 'b-2404' });

      expect(getCodes(result.data)).toEqual(['B-2404']);
    });

    it('searches by course name (partial and case-insensitive)', () => {
      const result = batchService.getBatches({ ...defaultQuery, search: 'full st' });

      expect(getCodes(result.data)).toEqual(['B-2401', 'B-2403', 'B-2406']);
      expect(result.pagination.totalRecords).toBe(3);
    });

    it('filters by status (case-insensitive)', () => {
      const result = batchService.getBatches({ ...defaultQuery, status: 'running' });

      expect(getCodes(result.data)).toEqual(['B-2401', 'B-2404']);
    });

    it('filters by centre', () => {
      const result = batchService.getBatches({ ...defaultQuery, centre: 'Leeds' });

      expect(getCodes(result.data)).toEqual(['B-2405', 'B-2407']);
    });

    it('applies search, status and centre together', () => {
      const result = batchService.getBatches({
        ...defaultQuery,
        search: 'full stack',
        status: 'Upcoming',
        centre: 'London-HQ',
      });

      expect(getCodes(result.data)).toEqual(['B-2406']);
      expect(result.pagination).toEqual({ page: 1, limit: 5, totalRecords: 1, totalPages: 1 });
    });

    it('returns the correct records for a later page', () => {
      const result = batchService.getBatches({ ...defaultQuery, page: 3, limit: 3 });

      expect(getCodes(result.data)).toEqual(['B-2407']);
      expect(result.pagination).toEqual({ page: 3, limit: 3, totalRecords: 7, totalPages: 3 });
    });

    it('recalculates pagination when filters reduce the results', () => {
      const result = batchService.getBatches({ ...defaultQuery, search: 'full stack', limit: 2 });

      expect(result.pagination).toEqual({ page: 1, limit: 2, totalRecords: 3, totalPages: 2 });
    });

    it('returns an empty page when the page number is past the last page', () => {
      const result = batchService.getBatches({ ...defaultQuery, page: 10 });

      expect(result.data).toEqual([]);
      expect(result.pagination.totalRecords).toBe(7);
    });

    it('returns no records and zero pages when nothing matches', () => {
      const result = batchService.getBatches({ ...defaultQuery, search: 'kotlin' });

      expect(result.data).toEqual([]);
      expect(result.pagination).toEqual({ page: 1, limit: 5, totalRecords: 0, totalPages: 0 });
    });
  });

  describe('getCentres', () => {
    it('returns each centre once, sorted alphabetically', () => {
      expect(batchService.getCentres()).toEqual(['Leeds', 'London-HQ', 'Manchester']);
    });
  });
});
