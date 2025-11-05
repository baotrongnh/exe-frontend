import { useState, useEffect, useCallback } from 'react';

interface UseAsyncOptions<T> {
     immediate?: boolean;
     onSuccess?: (data: T) => void;
     onError?: (error: Error) => void;
}

export function useAsync<T = any>(
     asyncFunction: (...args: any[]) => Promise<T>,
     options: UseAsyncOptions<T> = {}
) {
     const { immediate = false, onSuccess, onError } = options;

     const [data, setData] = useState<T | null>(null);
     const [loading, setLoading] = useState(immediate);
     const [error, setError] = useState<Error | null>(null);

     const execute = useCallback(
          async (...args: any[]) => {
               setLoading(true);
               setError(null);

               try {
                    const result = await asyncFunction(...args);
                    setData(result);
                    onSuccess?.(result);
                    return result;
               } catch (err) {
                    const error = err instanceof Error ? err : new Error(String(err));
                    setError(error);
                    onError?.(error);
                    throw error;
               } finally {
                    setLoading(false);
               }
          },
          [asyncFunction, onSuccess, onError]
     );

     useEffect(() => {
          if (immediate) {
               execute();
          }
     }, [immediate, execute]);

     return {
          data,
          loading,
          error,
          execute,
          reset: () => {
               setData(null);
               setError(null);
               setLoading(false);
          },
     };
}
