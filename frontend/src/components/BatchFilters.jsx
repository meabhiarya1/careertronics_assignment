import { ChevronDown, ListFilter, Search } from 'lucide-react';
import { STATUS_OPTIONS } from '../constants/batchConstants.js';

export function BatchFilters({
  search,
  status,
  centre,
  centres,
  onSearchChange,
  onStatusChange,
  onCentreChange,
  onReset,
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by Batch Code or Course"
          aria-label="Search by batch code or course"
          className="h-10 w-full rounded-md border border-gray-200 pr-3 pl-9 text-sm outline-none placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="flex gap-3">
        <SelectBox label="Filter by status" value={status} onChange={onStatusChange}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </SelectBox>

        <SelectBox label="Filter by centre" value={centre} onChange={onCentreChange}>
          <option value="">All Centres</option>
          {centres.map((centreName) => (
            <option key={centreName} value={centreName}>
              {centreName}
            </option>
          ))}
        </SelectBox>

        <button
          type="button"
          onClick={onReset}
          title="Reset filters"
          aria-label="Reset filters"
          className="flex size-10 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:border-brand-500 hover:text-brand-500"
        >
          <ListFilter className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function SelectBox({ label, value, onChange, children }) {
  return (
    <div className="relative flex-1 md:w-44 md:flex-none">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white pr-9 pl-3 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
    </div>
  );
}
