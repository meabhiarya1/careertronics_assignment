import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Debounces `callback` (always invoking its latest version).
 * Returns stable `[debounced, cancel]` functions; pending calls are cancelled on unmount.
 *
 * @template {(...args: any[]) => void} T
 * @param {T} callback
 * @param {number} delay  Milliseconds to wait after the last call
 * @returns {[T, () => void]}
 */
export function useDebouncedCallback(callback, delay) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef(null);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const cancel = useCallback(() => clearTimeout(timeoutRef.current), []);

  const debounced = useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay],
  );

  useEffect(() => cancel, [cancel]);

  return [debounced, cancel];
}
