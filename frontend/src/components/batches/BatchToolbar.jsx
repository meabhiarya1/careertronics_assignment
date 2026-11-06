import { FilterX } from 'lucide-react';
import { MODE_FILTER_OPTIONS, SEARCH_MAX_LENGTH } from '../../constants/batch.js';
import { hasActiveFilters } from '../../utils/batchQuery.js';
import { Button } from '../common/Button.jsx';
import { SearchInput } from '../common/SearchInput.jsx';
import { SelectField } from '../common/SelectField.jsx';
import { StatusTabs } from './StatusTabs.jsx';

export function BatchToolbar({ query, stats, onFilterChange, onReset }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 p-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
      <StatusTabs value={query.status} stats={stats} onChange={(status) => onFilterChange({ status })} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:min-w-0 xl:flex-1 xl:justify-end">
        <SearchInput
          value={query.search}
          onSearch={(search) => onFilterChange({ search })}
          label="Search batches by name, code, course or instructor"
          placeholder="Search name, code or instructor"
          maxLength={SEARCH_MAX_LENGTH}
          className="sm:flex-1 xl:max-w-80"
        />
        <div className="flex items-center gap-3">
          <SelectField
            label="Filter by mode"
            value={query.mode}
            options={MODE_FILTER_OPTIONS}
            onChange={(mode) => onFilterChange({ mode })}
            className="flex-1 sm:w-36 sm:flex-none"
          />
          {hasActiveFilters(query) && (
            <Button variant="ghost" onClick={onReset}>
              <FilterX className="size-4" aria-hidden="true" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
