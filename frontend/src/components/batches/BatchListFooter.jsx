import { PAGE_SIZE_OPTIONS } from '../../constants/batch.js';
import { formatNumber, pluralize } from '../../utils/format.js';
import { getVisibleRange } from '../../utils/pagination.js';
import { Pagination } from '../common/Pagination.jsx';
import { SelectField } from '../common/SelectField.jsx';

const PAGE_SIZE_SELECT_OPTIONS = PAGE_SIZE_OPTIONS.map((size) => ({ value: String(size), label: String(size) }));

/**
 * `meta` + `itemCount` describe the rows currently on screen (for the summary);
 * `page` + `pageSize` are the requested values, so controls react instantly.
 */
export function BatchListFooter({ meta, itemCount, page, pageSize, onPageChange, onPageSizeChange }) {
  const { from, to } = getVisibleRange(meta, itemCount);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-slate-600" aria-live="polite">
        {itemCount === 0 ? (
          'No results'
        ) : (
          <>
            Showing{' '}
            <span className="font-medium text-slate-900 tabular-nums">
              {from}–{to}
            </span>{' '}
            of <span className="font-medium text-slate-900 tabular-nums">{formatNumber(meta.total)}</span>{' '}
            {pluralize(meta.total, 'batch', 'batches')}
          </>
        )}
      </p>

      <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
        <SelectField
          label="Rows per page"
          hideLabel={false}
          size="sm"
          value={String(pageSize)}
          options={PAGE_SIZE_SELECT_OPTIONS}
          onChange={(value) => onPageSizeChange(Number(value))}
          className="shrink-0"
        />
        {meta.totalPages > 1 && (
          <Pagination page={page} totalPages={meta.totalPages} onPageChange={onPageChange} />
        )}
      </div>
    </div>
  );
}
