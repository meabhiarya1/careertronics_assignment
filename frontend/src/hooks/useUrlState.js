import { useEffect, useState } from 'react';

/**
 * State that is initialised from, and mirrored to, the URL query string so a
 * view survives refreshes and can be shared as a link.
 *
 * Uses history.replaceState: filter tweaks don't flood the back-button history.
 *
 * @param {(params: URLSearchParams) => object} parse
 * @param {(state: object) => URLSearchParams} serialize  Should be a stable reference
 */
export function useUrlState(parse, serialize) {
  const [state, setState] = useState(() => parse(new URLSearchParams(window.location.search)));

  useEffect(() => {
    const queryString = serialize(state).toString();
    const { pathname, search, hash } = window.location;
    const nextSearch = queryString ? `?${queryString}` : '';

    if (nextSearch !== search) {
      window.history.replaceState(window.history.state, '', `${pathname}${nextSearch}${hash}`);
    }
  }, [state, serialize]);

  return [state, setState];
}
