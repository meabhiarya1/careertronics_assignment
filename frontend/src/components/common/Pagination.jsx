import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import { focusRing } from '../../styles/classNames.js';
import { cn } from '../../utils/cn.js';
import { getPageItems } from '../../utils/pagination.js';

function PageButton({ isActive = false, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium tabular-nums transition-colors',
        'disabled:pointer-events-none disabled:opacity-40',
        focusRing,
        isActive
          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        className,
      )}
      {...props}
    />
  );
}

export function Pagination({ page, totalPages, onPageChange }) {
  const goTo = (target) => {
    if (target !== page) onPageChange(target);
  };

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <PageButton aria-label="Previous page" disabled={page <= 1} onClick={() => goTo(page - 1)}>
        <ChevronLeft className="size-4" aria-hidden="true" />
      </PageButton>

      <ul className="hidden items-center gap-1 sm:flex">
        {getPageItems(page, totalPages).map((item) => (
          <li key={item}>
            {typeof item === 'number' ? (
              <PageButton
                isActive={item === page}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => goTo(item)}
              >
                {item}
              </PageButton>
            ) : (
              <span className="inline-flex size-9 items-center justify-center text-slate-400">
                <Ellipsis className="size-4" aria-hidden="true" />
              </span>
            )}
          </li>
        ))}
      </ul>

      <span className="px-2 text-sm whitespace-nowrap text-slate-600 tabular-nums sm:hidden">
        Page {page} of {totalPages}
      </span>

      <PageButton aria-label="Next page" disabled={page >= totalPages} onClick={() => goTo(page + 1)}>
        <ChevronRight className="size-4" aria-hidden="true" />
      </PageButton>
    </nav>
  );
}
