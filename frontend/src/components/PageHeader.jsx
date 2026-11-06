import { Plus } from 'lucide-react';

export function PageHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">Batch Operations</h1>

      {/* UI only: creating batches is not part of this assignment */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-brand-500 bg-white px-4 py-2 text-sm font-medium text-brand-500 shadow-sm transition-colors hover:bg-brand-50"
      >
        <Plus className="size-4" aria-hidden="true" />
        Create Batch
      </button>
    </div>
  );
}
