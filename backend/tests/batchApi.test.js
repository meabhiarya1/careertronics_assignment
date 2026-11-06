import request from 'supertest';
import { createApp } from '../app.js';

// These tests use the real mock data (24 batches, 8 per status).
const app = createApp();
const getCodes = (response) => response.body.data.map((batch) => batch.batchCode);

describe('GET /api/batches', () => {
  it('returns the first 5 batches with pagination info by default', async () => {
    const response = await request(app).get('/api/batches').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(5);
    expect(response.body.pagination).toEqual({ page: 1, limit: 5, totalRecords: 24, totalPages: 5 });
  });

  it('returns every field the table needs for each batch', async () => {
    const response = await request(app).get('/api/batches').expect(200);

    expect(response.body.data[0]).toEqual({
      id: 1,
      batchCode: 'B-2601',
      courseName: 'Full Stack',
      centreName: 'London-HQ',
      startDate: '2026-01-12',
      enrolledStudents: 35,
      totalCapacity: 35,
      status: 'Completed',
    });
  });

  it('searches by batch code', async () => {
    const response = await request(app).get('/api/batches?search=B-2609').expect(200);

    expect(getCodes(response)).toEqual(['B-2609']);
  });

  it('searches by course name', async () => {
    const response = await request(app).get('/api/batches?search=full stack').expect(200);

    expect(response.body.pagination.totalRecords).toBe(6);
    expect(response.body.data.every((batch) => batch.courseName === 'Full Stack')).toBe(true);
  });

  it('filters by status', async () => {
    const response = await request(app).get('/api/batches?status=Running&limit=50').expect(200);

    expect(response.body.pagination.totalRecords).toBe(8);
    expect(response.body.data.every((batch) => batch.status === 'Running')).toBe(true);
  });

  it('filters by centre', async () => {
    const response = await request(app).get('/api/batches?centre=London-HQ&limit=50').expect(200);

    expect(response.body.pagination.totalRecords).toBe(8);
    expect(response.body.data.every((batch) => batch.centreName === 'London-HQ')).toBe(true);
  });

  it('applies search and filters together', async () => {
    const response = await request(app)
      .get('/api/batches')
      .query({ search: 'full stack', status: 'Running', centre: 'London-HQ' })
      .expect(200);

    expect(getCodes(response)).toEqual(['B-2609']);
    expect(response.body.pagination).toEqual({ page: 1, limit: 5, totalRecords: 1, totalPages: 1 });
  });

  it('treats empty query values as "not set"', async () => {
    const response = await request(app)
      .get('/api/batches?page=1&limit=5&search=&status=&centre=')
      .expect(200);

    expect(response.body.pagination.totalRecords).toBe(24);
  });

  it('returns the next 5 batches for page 2', async () => {
    const response = await request(app).get('/api/batches?page=2').expect(200);

    expect(getCodes(response)).toEqual(['B-2606', 'B-2607', 'B-2608', 'B-2609', 'B-2610']);
  });

  it('returns the remaining 4 batches on the last page', async () => {
    const response = await request(app).get('/api/batches?page=5').expect(200);

    expect(getCodes(response)).toEqual(['B-2702', 'B-2703', 'B-2704', 'B-2705']);
  });

  it('returns an empty list when nothing matches', async () => {
    const response = await request(app).get('/api/batches?search=kotlin').expect(200);

    expect(response.body.data).toEqual([]);
    expect(response.body.pagination).toEqual({ page: 1, limit: 5, totalRecords: 0, totalPages: 0 });
  });

  it.each([
    ['page=0', 'page must be a positive whole number'],
    ['page=abc', 'page must be a positive whole number'],
    ['limit=0', 'limit must be a positive whole number'],
    ['limit=51', 'limit cannot be more than 50'],
    ['status=Cancelled', 'status must be one of: Running, Upcoming, Completed'],
  ])('returns 400 for invalid query "%s"', async (queryString, message) => {
    const response = await request(app).get(`/api/batches?${queryString}`).expect(400);

    expect(response.body).toEqual({ success: false, message });
  });
});

describe('GET /api/batches/centres', () => {
  it('returns the list of centres for the filter dropdown', async () => {
    const response = await request(app).get('/api/batches/centres').expect(200);

    expect(response.body).toEqual({
      success: true,
      data: ['Birmingham', 'Leeds', 'London-HQ', 'Manchester'],
    });
  });
});

describe('other routes', () => {
  it('GET /api/health reports that the API is running', async () => {
    const response = await request(app).get('/api/health').expect(200);

    expect(response.body.success).toBe(true);
  });

  it('returns 404 JSON for unknown routes', async () => {
    const response = await request(app).get('/api/unknown').expect(404);

    expect(response.body).toEqual({ success: false, message: 'Route not found: GET /api/unknown' });
  });

  it('does not allow POST requests', async () => {
    await request(app).post('/api/batches').send({}).expect(404);
  });
});
