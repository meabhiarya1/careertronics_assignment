import { BatchEmptyState } from '../components/batches/BatchEmptyState.jsx';
import { BatchListFooter } from '../components/batches/BatchListFooter.jsx';
import { BatchTable } from '../components/batches/BatchTable.jsx';
import { BatchToolbar } from '../components/batches/BatchToolbar.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { AppHeader } from '../components/layout/AppHeader.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { StatsOverview } from '../components/stats/StatsOverview.jsx';
import { useBatchQuery } from '../hooks/useBatchQuery.js';
import { useBatches } from '../hooks/useBatches.js';
import { useBatchStats } from '../hooks/useBatchStats.js';
import { cardSurface } from '../styles/classNames.js';
import { hasActiveFilters } from '../utils/batchQuery.js';
import { cn } from '../utils/cn.js';

export function BatchOperationsPage() {
  const { query, updateFilters, setPage, setPageSize, toggleSort, resetFilters } = useBatchQuery();
  const { items, meta, error, isLoading, retry } = useBatches(query);
  const { stats, isLoading: isStatsLoading } = useBatchStats();

  const showFooter = Boolean(meta && items && !error);

  return (
    <div className="relative isolate min-h-dvh">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-linear-to-b from-indigo-100/70 via-indigo-50/40 to-transparent"
      />

      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <PageHeader
          breadcrumbs={['Operations', 'Batches']}
          title="Batch Operations"
          description="Track every training batch across courses. Search, filter and review schedules, enrollment and status in one place."
        />

        <StatsOverview stats={stats} isLoading={isStatsLoading} className="mt-8" />

        <section aria-labelledby="batch-list-heading" className={cn(cardSurface, 'mt-8 overflow-hidden')}>
          <h2 id="batch-list-heading" className="sr-only">
            Batches
          </h2>

          <BatchToolbar query={query} stats={stats} onFilterChange={updateFilters} onReset={resetFilters} />

          <BatchTable
            items={items}
            isLoading={isLoading}
            error={error}
            sortBy={query.sortBy}
            order={query.order}
            onSort={toggleSort}
            skeletonRows={Math.min(query.limit, 10)}
            errorState={<ErrorState title="Couldn't load batches" message={error?.message} onRetry={retry} />}
            emptyState={
              <BatchEmptyState
                isPageOutOfRange={(meta?.total ?? 0) > 0}
                hasFilters={hasActiveFilters(query)}
                onResetFilters={resetFilters}
                onFirstPage={() => setPage(1)}
              />
            }
          />

          {showFooter && (
            <BatchListFooter
              meta={meta}
              itemCount={items.length}
              page={query.page}
              pageSize={query.limit}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </section>
      </main>
    </div>
  );
}
