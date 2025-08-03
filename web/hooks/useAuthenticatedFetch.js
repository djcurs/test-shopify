
import { useMemo } from "react";


export function useAuthenticatedFetch() {
  const fetchFunction = useMemo(() => {
    return async (url, options = {}) => {
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