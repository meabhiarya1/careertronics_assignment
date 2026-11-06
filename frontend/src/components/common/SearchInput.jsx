import { Search, X } from 'lucide-react';
import { useId, useState } from 'react';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback.js';
import { focusRing, inputBase } from '../../styles/classNames.js';
import { cn } from '../../utils/cn.js';

/**
 * Search box that keeps its own draft text for instant typing feedback and
 * reports the trimmed value via `onSearch` after the user pauses.
 *
 * @param {object} props
 * @param {string} props.value  The committed search term (e.g. from the URL)
 * @param {(term: string) => void} props.onSearch
 */
export function SearchInput({
  value,
  onSearch,
  label = 'Search',
  placeholder = 'Search…',
  delay = 350,
  maxLength,
  className,
}) {
  const id = useId();
  const [draft, setDraft] = useState(value);
  const [lastCommitted, setLastCommitted] = useState(value);
  const [debouncedSearch, cancelPendingSearch] = useDebouncedCallback(onSearch, delay);

  // Sync when the committed value changes from outside (e.g. "Clear filters").
  // Skip when it matches what's typed, so trailing spaces aren't stripped mid-typing.
  if (value !== lastCommitted) {
    setLastCommitted(value);
    if (value !== draft.trim()) setDraft(value);
  }

  const handleChange = (event) => {
    setDraft(event.target.value);
    debouncedSearch(event.target.value.trim());
  };

  const handleClear = () => {
    setDraft('');
    cancelPendingSearch();
    onSearch('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && draft) handleClear();
  };

  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
      />
      <input
        id={id}
        type="search"
        value={draft}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
        spellCheck={false}
        className={cn(inputBase, 'h-10 pr-9 pl-9')}
      />
      {draft && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className={cn(
            'absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors',
            'hover:bg-slate-100 hover:text-slate-600',
            focusRing,
          )}
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
