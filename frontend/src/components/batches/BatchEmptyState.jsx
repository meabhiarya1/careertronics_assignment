import { FilterX, Inbox, SearchX } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { EmptyState } from '../common/EmptyState.jsx';

export function BatchEmptyState({ isPageOutOfRange, hasFilters, onResetFilters, onFirstPage }) {
  if (isPageOutOfRange) {
    return (
      <EmptyState
        icon={Inbox}
        title="Nothing on this page"
        description="This page is past the end of the results."
        action={<Button onClick={onFirstPage}>Go to first page</Button>}
      />
    );
  }

  if (hasFilters) {
    return (
      <EmptyState
        icon={SearchX}
        title="No batches match your filters"
        description="Try a different search term, or clear the filters to see every batch."
        action={
          <Button onClick={onResetFilters}>
            <FilterX className="size-4" aria-hidden="true" />
            Clear filters
          </Button>
        }
      />
    );
  }

  return (
    <EmptyState
      icon={Inbox}
      title="No batches yet"
      description="Batches will show up here once they are scheduled."
    />
  );
}
