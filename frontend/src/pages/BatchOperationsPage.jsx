import { useState } from 'react';
import { BatchFilters } from '../components/BatchFilters.jsx';
import { BatchTable } from '../components/BatchTable.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { SEARCH_DELAY_MS } from '../constants/batchConstants.js';
import { useBatches } from '../hooks/useBatches.js';
import { useCentres } from '../hooks/useCentres.js';
import { useDebounce } from '../hooks/useDebounce.js';

export function BatchOperationsPage() {
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');
  const [centre, setCentre] = useState('');
  const [page, setPage] = useState(1);

  // Wait until the user stops typing before searching.
  const search = useDebounce(searchText.trim(), SEARCH_DELAY_MS);

  const { batches, pagination, isLoading, error, retry } = useBatches({ search, status, centre, page });
  const centres = useCentres();

  // Changing the search or a filter always goes back to page 1.
  function handleSearchChange(value) {
    setSearchText(value);
    setPage(1);
  }

  function handleStatusChange(value) {
    setStatus(value);
    setPage(1);
  }

  function handleCentreChange(value) {
    setCentre(value);
    setPage(1);
  }

  function handleReset() {
    setSearchText('');
    setStatus('');
    setCentre('');
    setPage(1);
  }

  const showPagination = !error && pagination && pagination.totalRecords > 0;

  return (
    <>
      <PageHeader />

      <BatchFilters
        search={searchText}
        status={status}
        centre={centre}
        centres={centres}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onCentreChange={handleCentreChange}
        onReset={handleReset}
      />

      <section className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <BatchTable batches={batches} isLoading={isLoading} error={error} onRetry={retry} />
        {showPagination && <Pagination pagination={pagination} onPageChange={setPage} />}
      </section>
    </>
  );
}
