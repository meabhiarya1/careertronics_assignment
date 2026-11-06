import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPageNumbers } from '../utils/getPageNumbers.js';

export function Pagination({ pagination, onPageChange }) {
  const { page, limit, totalRecords, totalPages } = pagination;

  const firstRecord = (page - 1) * limit + 1;
  const lastRecord = Math.min(page * limit, totalRecords);

  return (
    <div className="flex flex-col gap-3 border-t border-gray-200 bg-brand-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-600">
        Showing {firstRecord}–{lastRecord} of {totalRecords} {totalRecords === 1 ? 'Batch' : 'Batches'}
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        <PageButton aria-label="Previous page" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="size-4" aria-hidden="true" />
        </PageButton>

        {getPageNumbers(page, totalPages).map((pageNumber) => (
          <PageButton
            key={pageNumber}
            isActive={pageNumber === page}
            aria-current={pageNumber === page ? 'page' : undefined}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </PageButton>
        ))}

        <PageButton aria-label="Next page" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight className="size-4" aria-hidden="true" />
        </PageButton>
      </nav>
    </div>
  );
}

function PageButton({ isActive = false, ...props }) {
  return (
    <button
      type="button"
      className={`flex size-8 items-center justify-center rounded border text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        isActive
          ? 'border-brand-500 bg-brand-500 font-medium text-white'
          : 'border-gray-200 bg-white text-gray-600 hover:border-brand-500 hover:text-brand-500'
      }`}
      {...props}
    />
  );
}
