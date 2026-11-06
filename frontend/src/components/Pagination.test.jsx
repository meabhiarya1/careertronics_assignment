import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination.jsx';

function renderPagination(pagination) {
  const onPageChange = vi.fn();
  render(<Pagination pagination={pagination} onPageChange={onPageChange} />);
  return { onPageChange };
}

describe('Pagination', () => {
  it('shows the current record range and the total number of records', () => {
    renderPagination({ page: 2, limit: 5, totalRecords: 24, totalPages: 5 });

    expect(screen.getByText('Showing 6–10 of 24 Batches')).toBeInTheDocument();
  });

  it('shows a shorter range on the last page', () => {
    renderPagination({ page: 5, limit: 5, totalRecords: 24, totalPages: 5 });

    expect(screen.getByText('Showing 21–24 of 24 Batches')).toBeInTheDocument();
  });

  it('uses "Batch" (singular) when there is only one record', () => {
    renderPagination({ page: 1, limit: 5, totalRecords: 1, totalPages: 1 });

    expect(screen.getByText('Showing 1–1 of 1 Batch')).toBeInTheDocument();
  });

  it('disables Previous on the first page and Next on the last page', () => {
    renderPagination({ page: 1, limit: 5, totalRecords: 10, totalPages: 2 });
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
  });

  it('disables Next on the last page', () => {
    renderPagination({ page: 2, limit: 5, totalRecords: 10, totalPages: 2 });

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
  });

  it('marks the current page', () => {
    renderPagination({ page: 3, limit: 5, totalRecords: 24, totalPages: 5 });

    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: '2' })).not.toHaveAttribute('aria-current');
  });

  it('calls onPageChange with the right page for Previous, Next and page numbers', async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 3, limit: 5, totalRecords: 24, totalPages: 5 });

    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    await user.click(screen.getByRole('button', { name: '5' }));

    expect(onPageChange.mock.calls).toEqual([[2], [4], [5]]);
  });
});
