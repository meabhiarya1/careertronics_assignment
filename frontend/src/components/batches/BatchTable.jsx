import { cn } from '../../utils/cn.js';
import { BatchTableRow } from './BatchTableRow.jsx';
import { BatchTableSkeleton } from './BatchTableSkeleton.jsx';
import { SortableHeader } from './SortableHeader.jsx';

const FIRST_CELL = 'pr-4 pl-4 sm:pl-6';
const LAST_CELL = 'pr-4 pl-4 sm:pr-6';

const COLUMNS = [
  { id: 'batch', label: 'Batch', sortField: 'batchName', defaultOrder: 'asc', className: FIRST_CELL },
  { id: 'instructor', label: 'Instructor' },
  { id: 'mode', label: 'Mode' },
  { id: 'schedule', label: 'Schedule', sortField: 'startDate', defaultOrder: 'desc' },
  { id: 'enrollment', label: 'Enrollment', sortField: 'enrolled', defaultOrder: 'desc' },
  { id: 'status', label: 'Status', className: LAST_CELL },
];

const HEADER_CELL = 'py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-slate-500 uppercase';

function StateRow({ children }) {
  return (
    <tr>
      <td colSpan={COLUMNS.length}>{children}</td>
    </tr>
  );
}

/**
 * @param {object} props
 * @param {object[] | undefined} props.items  `undefined` = nothing loaded yet
 * @param {boolean} props.isLoading
 * @param {Error | null} props.error
 * @param {React.ReactNode} props.emptyState
 * @param {React.ReactNode} props.errorState
 */
export function BatchTable({
  items,
  isLoading,
  error,
  sortBy,
  order,
  onSort,
  emptyState,
  errorState,
  skeletonRows = 8,
}) {
  const isInitialLoad = items === undefined && !error;
  const isRefreshing = isLoading && items !== undefined;

  let body;
  if (error) {
    body = <StateRow>{errorState}</StateRow>;
  } else if (isInitialLoad) {
    body = <BatchTableSkeleton rows={skeletonRows} />;
  } else if (items.length === 0) {
    body = <StateRow>{emptyState}</StateRow>;
  } else {
    body = items.map((batch) => <BatchTableRow key={batch.id} batch={batch} />);
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-indigo-100">
          <div className="h-full w-1/3 animate-progress rounded-full bg-indigo-500" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left" aria-busy={isLoading}>
          <thead className="border-b border-slate-200/80 bg-slate-50/70">
            <tr>
              {COLUMNS.map((column) => {
                const className = cn(HEADER_CELL, column.className ?? 'px-4');
                return column.sortField ? (
                  <SortableHeader
                    key={column.id}
                    label={column.label}
                    field={column.sortField}
                    defaultOrder={column.defaultOrder}
                    sortBy={sortBy}
                    order={order}
                    onSort={onSort}
                    className={className}
                  />
                ) : (
                  <th key={column.id} scope="col" className={className}>
                    {column.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody
            className={cn(
              'divide-y divide-slate-100 transition-opacity duration-200',
              isInitialLoad && 'animate-pulse',
              isRefreshing && 'opacity-55',
            )}
          >
            {body}
          </tbody>
        </table>
      </div>
    </div>
  );
}
