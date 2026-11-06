import request from 'supertest';
import { createApp } from '../src/app.js';
import { batchesFixture } from './fixtures/batches.fixture.js';

const app = createApp({ batches: batchesFixture });

describe('Batch API', () => {
  describe('GET /api/v1/batches', () => {
    it('responds with the list envelope and pagination meta', async () => {
      const res = await request(app).get('/api/v1/batches').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(5);
      expect(res.body.meta).toEqual({
        page: 1,
        limit: 10,
        total: 5,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    });

    it('applies search, filters, sorting and pagination from the query string', async () => {
      const res = await request(app)
        .get('/api/v1/batches')
        .query({ search: 'web', status: 'completed', sortBy: 'batchName', order: 'asc', limit: 1 })
        .expect(200);

      expect(res.body.data.map((batch) => batch.id)).toEqual([1]);
      expect(res.body.meta).toMatchObject({ total: 1, limit: 1, totalPages: 1 });
    });

    it('treats empty query params as "not provided"', async () => {
      const res = await request(app).get('/api/v1/batches?search=&status=&page=').expect(200);

      expect(res.body.meta.total).toBe(5);
    });

    it.each([
      ['page=0', 'page'],
      ['page=abc', 'page'],
      ['limit=101', 'limit'],
      ['status=archived', 'status'],
      ['mode=remote', 'mode'],
      ['sortBy=password', 'sortBy'],
      ['order=up', 'order'],
      ['status=ongoing&status=completed', 'status'],
    ])('returns 400 for invalid query "%s"', async (queryString, field) => {
      const res = await request(app).get(`/api/v1/batches?${queryString}`).expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field })]),
      );
    });

    it('reports every invalid field at once', async () => {
      const res = await request(app).get('/api/v1/batches?page=-1&limit=0').expect(400);

      expect(res.body.error.details.map((detail) => detail.field)).toEqual(['page', 'limit']);
    });
  });

  describe('GET /api/v1/batches/stats', () => {
    it('returns aggregate counts', async () => {
      const res = await request(app).get('/api/v1/batches/stats').expect(200);

      expect(res.body.data).toEqual({
        totalBatches: 5,
        totalEnrolled: 161,
        byStatus: { upcoming: 1, ongoing: 1, completed: 2, cancelled: 1 },
      });
    });
  });

  describe('GET /api/v1/batches/:id', () => {
    it('returns a single batch', async () => {
      const res = await request(app).get('/api/v1/batches/2').expect(200);

      expect(res.body.data).toMatchObject({ id: 2, batchCode: 'DSC-2603-01' });
    });

    it('returns 404 for an unknown batch', async () => {
      const res = await request(app).get('/api/v1/batches/999').expect(404);

      expect(res.body.error.message).toMatch(/not found/i);
    });

    it('returns 400 for a non-numeric id', async () => {
      await request(app).get('/api/v1/batches/abc').expect(400);
    });
  });

  describe('infrastructure', () => {
    it('exposes a health check', async () => {
      const res = await request(app).get('/health').expect(200);

      expect(res.body.status).toBe('ok');
    });

    it('returns a JSON 404 for unknown routes', async () => {
      const res = await request(app).get('/api/v1/unknown').expect(404);

      expect(res.body).toEqual({
        success: false,
        error: { message: 'Route GET /api/v1/unknown not found' },
      });
    });
  });
});
