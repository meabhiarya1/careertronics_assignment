import { EllipsisVertical, LoaderCircle, SearchX, TriangleAlert } from 'lucide-react';
import { formatDate } from '../utils/formatDate.js';
import { StatusBadge } from './StatusBadge.jsx';

const COLUMNS = ['Batch Code', 'Course', 'Center', 'Start Date', 'Capacity', 'Status', 'Actions'];

export function BatchTable({ batches, isLoading, error, onRetry }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-brand-50 text-xs tracking-wide text-gray-500 uppercase">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="px-6 py-4 font-medium whitespace-nowrap">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <TableBody batches={batches} isLoading={isLoading} error={error} onRetry={onRetry} />
        </tbody>
      </table>
    </div>
  );
}

// Decides what to show inside the table: loading, error, empty or the rows.
function TableBody({ batches, isLoading, error, onRetry }) {
  if (isLoading) {
    return (
      <MessageRow>
        <div role="status" className="flex items-center justify-center gap-2 text-gray-500">
          <LoaderCircle className="size-5 animate-spin text-brand-500" aria-hidden="true" />
          Loading batches...
        </div>
      </MessageRow>
    );
  }

  if (error) {
    return (
      <MessageRow>
        <div role="alert" className="flex flex-col items-center gap-2">
          <TriangleAlert className="size-6 text-red-500" aria-hidden="true" />
          <p className="font-medium text-gray-900">Failed to load batches</p>
          <p className="text-gray-500">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Retry
          </button>
        </div>
      </MessageRow>
    );
  }

  if (batches.length === 0) {
    return (
      <MessageRow>
        <div className="flex flex-col items-center gap-2">
          <SearchX className="size-6 text-gray-400" aria-hidden="true" />
          <p className="font-medium text-gray-900">No batches found</p>
          <p className="text-gray-500">Try a different search term or change the filters.</p>
        </div>
      </MessageRow>
    );
  }

  return batches.map((batch) => <BatchRow key={batch.id} batch={batch} />);
}

function BatchRow({ batch }) {
  return (
    <tr className="whitespace-nowrap transition-colors hover:bg-gray-50">
      <td className="px-6 py-5 font-medium text-brand-500">{batch.batchCode}</td>
      <td className="px-6 py-5 text-gray-700">{batch.courseName}</td>
      <td className="px-6 py-5 text-gray-700">{batch.centreName}</td>
      <td className="px-6 py-5 text-gray-500">{formatDate(batch.startDate)}</td>
      <td className="px-6 py-5 font-medium text-gray-800">
        {batch.enrolledStudents}/{batch.totalCapacity}
      </td>
      <td className="px-6 py-5">
        <StatusBadge status={batch.status} />
      </td>
      <td className="px-6 py-5">
        {/* UI only, like the reference design */}
        <button
          type="button"
          aria-label={`Actions for ${batch.batchCode}`}
          className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <EllipsisVertical className="size-4" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}

function MessageRow({ children }) {
  return (
    <tr>
      <td colSpan={COLUMNS.length} className="px-6 py-14 text-center">
        {children}
      </td>
    </tr>
  );
}
