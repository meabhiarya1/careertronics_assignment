import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const INITIAL_RESULT = { requestId: null, data: undefined, error: null };

/**
 * Runs `fetcher` whenever `key` changes, aborting the previous in-flight request
 * so a slow, stale response can never overwrite a newer one.
 *
 * `isLoading` is derived (the stored result belongs to an older request) rather
 * than set imperatively, and the previous `data` stays available while the next
 * request is in flight — so tables can dim instead of flashing to a skeleton.
 *
 * @template T
 * @param {(signal: AbortSignal) => Promise<T>} fetcher
 * @param {string} key  Serialisable identity of the request (e.g. JSON of params)
 */
export function useAsync(fetcher, key) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(INITIAL_RESULT);
  const fetcherRef = useRef(fetcher);

  useLayoutEffect(() => {
    fetcherRef.current = fetcher;
  });

  const requestId = `${key}#${attempt}`;

  useEffect(() => {
    const controller = new AbortController();

    fetcherRef.current(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setResult({ requestId, data, error: null });
      },
      (error) => {
        if (!controller.signal.aborted) setResult({ requestId, data: undefined, error });
      },
    );

    return () => controller.abort();
  }, [requestId]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);
  const isLoading = result.requestId !== requestId;

  return {
    data: result.data,
    error: isLoading ? null : result.error,
    isLoading,
    retry,
  };
}
