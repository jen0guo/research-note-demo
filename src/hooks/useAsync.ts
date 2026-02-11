import { useCallback, useRef, useState } from "react";

type AsyncState<T> = {
  loading: boolean;
  value: T | null;
  error: string | null;
};

type UseAsyncReturn<TArgs extends unknown[], TResult> = AsyncState<TResult> & {
  execute: (...args: TArgs) => Promise<TResult>;
  reset: () => void;
};

/**
 * Small reusable async hook:
 * - typed args + return
 * - loading/error/value state
 * - protects against race conditions (only latest call wins)
 */
export function useAsync<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
): UseAsyncReturn<TArgs, TResult> {
  const [state, setState] = useState<AsyncState<TResult>>({
    loading: false,
    value: null,
    error: null,
  });

  const callIdRef = useRef(0);

  const execute = useCallback(
    async (...args: TArgs) => {
      const callId = ++callIdRef.current;
      setState({ loading: true, value: null, error: null });

      try {
        const result = await fn(...args);
        if (callId === callIdRef.current) {
          setState({ loading: false, value: result, error: null });
        }
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong.";
        if (callId === callIdRef.current) {
          setState({ loading: false, value: null, error: message });
        }
        throw err;
      }
    },
    [fn]
  );

  const reset = useCallback(() => {
    callIdRef.current++;
    setState({ loading: false, value: null, error: null });
  }, []);

  return { ...state, execute, reset };
}
