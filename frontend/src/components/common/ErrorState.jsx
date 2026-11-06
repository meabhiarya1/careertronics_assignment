import { RotateCcw, TriangleAlert } from 'lucide-react';
import { Button } from './Button.jsx';
import { EmptyState } from './EmptyState.jsx';

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div role="alert">
      <EmptyState
        tone="danger"
        icon={TriangleAlert}
        title={title}
        description={message ?? 'An unexpected error occurred. Please try again.'}
        action={
          onRetry && (
            <Button onClick={onRetry}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Try again
            </Button>
          )
        }
      />
    </div>
  );
}
