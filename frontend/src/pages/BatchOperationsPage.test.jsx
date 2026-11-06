import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { batchService } from '../services/batchService.js';
import { BatchOperationsPage } from './BatchOperationsPage.jsx';

// Replace the real API calls with fake ones, so tests don't need the backend.
vi.mock('../services/batchService.js', () => ({
  batchService: {
    getBatches: vi.fn(),
    getCentres: vi.fn(),
  },
}));

const sampleBatches = [
  { id: 1, batchCode: 'B-2601', courseName: 'Full Stack', centreName: 'London-HQ', startDate: '2026-05-04', enrolledStudents: 22, totalCapacity: 35, status: 'Running' },
  { id: 2, batchCode: 'B-2602', courseName: 'Data Analytics', centreName: 'Leeds', startDate: '2026-11-16', enrolledStudents: 12, totalCapacity: 30, status: 'Upcoming' },
];

// A fake API response: 12 records in total, so there are 3 pages of 5.
function fakeResponse({ page }) {
  return {
    success: true,
    data: sampleBatches,
    pagination: { page, limit: 5, totalRecords: 12, totalPages: 3 },
  };
}

// The parameters sent to the API in the most recent call.
function lastRequest() {
  const calls = batchService.getBatches.mock.calls;
  return calls[calls.length - 1][0];
}

async function renderPage() {
  const user = userEvent.setup();
  render(<BatchOperationsPage />);
  await screen.findByText('B-2601');
  return user;
}

describe('BatchOperationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    batchService.getBatches.mockImplementation(async (params) => fakeResponse(params));
    batchService.getCentres.mockResolvedValue(['Leeds', 'London-HQ', 'Manchester']);
  });

  describe('batch listing', () => {
    it('shows a loading state while the batches are being fetched', async () => {
      render(<BatchOperationsPage />);

      expect(screen.getByRole('status')).toHaveTextContent('Loading batches...');
      await screen.findByText('B-2601');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('requests the first page with 5 records and no filters', async () => {
      await renderPage();

      expect(lastRequest()).toEqual({ search: '', status: '', centre: '', page: 1, limit: 5 });
    });

    it('shows every column and the batch details from the API', async () => {
      await renderPage();

      ['Batch Code', 'Course', 'Center', 'Start Date', 'Capacity', 'Status', 'Actions'].forEach((column) => {
        expect(screen.getByRole('columnheader', { name: column })).toBeInTheDocument();
      });

      const firstRow = screen.getByText('B-2601').closest('tr');
      expect(within(firstRow).getByText('Full Stack')).toBeInTheDocument();
      expect(within(firstRow).getByText('London-HQ')).toBeInTheDocument();
      expect(within(firstRow).getByText('May 4, 2026')).toBeInTheDocument();
      expect(within(firstRow).getByText('22/35')).toBeInTheDocument();
      expect(within(firstRow).getByText('Running')).toBeInTheDocument();
      expect(within(firstRow).getByRole('button', { name: 'Actions for B-2601' })).toBeInTheDocument();
    });

    it('shows the Create Batch button', async () => {
      await renderPage();

      expect(screen.getByRole('button', { name: /create batch/i })).toBeInTheDocument();
    });
  });

  describe('empty and error states', () => {
    it('shows an empty state when no batches match', async () => {
      batchService.getBatches.mockResolvedValue({
        success: true,
        data: [],
        pagination: { page: 1, limit: 5, totalRecords: 0, totalPages: 0 },
      });

      render(<BatchOperationsPage />);

      expect(await screen.findByText('No batches found')).toBeInTheDocument();
      expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument();
    });

    it('shows the error message from the API', async () => {
      batchService.getBatches.mockRejectedValue({
        response: { data: { message: 'status must be one of: Running, Upcoming, Completed' } },
      });

      render(<BatchOperationsPage />);

      const alert = await screen.findByRole('alert');
      expect(alert).toHaveTextContent('Failed to load batches');
      expect(alert).toHaveTextContent('status must be one of: Running, Upcoming, Completed');
    });

    it('shows a friendly message when the server cannot be reached, and Retry loads again', async () => {
      batchService.getBatches.mockRejectedValueOnce(new Error('Network Error'));
      const user = userEvent.setup();

      render(<BatchOperationsPage />);

      expect(await screen.findByRole('alert')).toHaveTextContent('Please check that the server is running');

      await user.click(screen.getByRole('button', { name: 'Retry' }));

      expect(await screen.findByText('B-2601')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('search and filters', () => {
    it('fills the centre filter with centres from the API, after "All Centres"', async () => {
      await renderPage();

      const centreFilter = screen.getByRole('combobox', { name: 'Filter by centre' });
      await waitFor(() => {
        const options = within(centreFilter).getAllByRole('option').map((option) => option.textContent);
        expect(options).toEqual(['All Centres', 'Leeds', 'London-HQ', 'Manchester']);
      });
    });

    it('has "All Status" plus Running, Upcoming and Completed in the status filter', async () => {
      await renderPage();

      const statusFilter = screen.getByRole('combobox', { name: 'Filter by status' });
      const options = within(statusFilter).getAllByRole('option').map((option) => option.textContent);
      expect(options).toEqual(['All Status', 'Running', 'Upcoming', 'Completed']);
    });

    it('searches after the user stops typing', async () => {
      const user = await renderPage();

      await user.type(screen.getByRole('searchbox'), 'full stack');

      await waitFor(() => expect(lastRequest()).toMatchObject({ search: 'full stack', page: 1 }));
      // Not one request per key press: only the initial load and the final search term.
      expect(batchService.getBatches.mock.calls.map((call) => call[0].search)).toEqual(['', 'full stack']);
    });

    it('filters by status', async () => {
      const user = await renderPage();

      await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by status' }), 'Running');

      await waitFor(() => expect(lastRequest()).toMatchObject({ status: 'Running', page: 1 }));
    });

    it('filters by centre', async () => {
      const user = await renderPage();
      await screen.findByRole('option', { name: 'Leeds' });

      await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by centre' }), 'Leeds');

      await waitFor(() => expect(lastRequest()).toMatchObject({ centre: 'Leeds', page: 1 }));
    });

    it('sends search, status and centre together', async () => {
      const user = await renderPage();
      await screen.findByRole('option', { name: 'London-HQ' });

      await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by status' }), 'Running');
      await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by centre' }), 'London-HQ');
      await user.type(screen.getByRole('searchbox'), 'B-26');

      await waitFor(() =>
        expect(lastRequest()).toEqual({ search: 'B-26', status: 'Running', centre: 'London-HQ', page: 1, limit: 5 }),
      );
    });

    it('goes back to page 1 when the search or a filter changes', async () => {
      const user = await renderPage();

      await user.click(screen.getByRole('button', { name: '3' }));
      await waitFor(() => expect(lastRequest()).toMatchObject({ page: 3 }));

      await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by status' }), 'Upcoming');

      await waitFor(() => expect(lastRequest()).toMatchObject({ status: 'Upcoming', page: 1 }));
    });

    it('resets the search and filters with the filter button', async () => {
      const user = await renderPage();
      const searchBox = screen.getByRole('searchbox');
      const statusFilter = screen.getByRole('combobox', { name: 'Filter by status' });

      await user.type(searchBox, 'data');
      await user.selectOptions(statusFilter, 'Completed');
      await waitFor(() => expect(lastRequest()).toMatchObject({ search: 'data', status: 'Completed' }));

      await user.click(screen.getByRole('button', { name: 'Reset filters' }));

      expect(searchBox).toHaveValue('');
      expect(statusFilter).toHaveValue('');
      await waitFor(() => expect(lastRequest()).toEqual({ search: '', status: '', centre: '', page: 1, limit: 5 }));
    });
  });

  describe('pagination', () => {
    it('shows the record range and total', async () => {
      await renderPage();

      expect(screen.getByText('Showing 1–5 of 12 Batches')).toBeInTheDocument();
    });

    it('loads the next page, a clicked page number and the previous page', async () => {
      const user = await renderPage();

      await user.click(screen.getByRole('button', { name: 'Next page' }));
      await waitFor(() => expect(lastRequest()).toMatchObject({ page: 2 }));

      await user.click(await screen.findByRole('button', { name: '3' }));
      await waitFor(() => expect(lastRequest()).toMatchObject({ page: 3 }));

      await user.click(await screen.findByRole('button', { name: 'Previous page' }));
      await waitFor(() => expect(lastRequest()).toMatchObject({ page: 2 }));
    });
  });
});
