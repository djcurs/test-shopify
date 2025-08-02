
import { useMemo } from "react";

/**
 * A hook that returns an authenticated fetch function.
 * This function will automatically include the necessary headers
 * for authenticated requests to your app's backend.
 */
export function useAuthenticatedFetch() {
  const fetchFunction = useMemo(() => {
    return async (url, options = {}) => {
      // Don't add /api prefix if it's already there
      const apiUrl = url.startsWith('/api/') ? url : `/api${url}`;
      
      return fetch(apiUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    };
  }, []);

  return fetchFunction;
}