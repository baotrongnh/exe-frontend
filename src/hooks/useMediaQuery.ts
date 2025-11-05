import { useState, useEffect } from 'react';

interface UseMediaQueryOptions {
     defaultValue?: boolean;
     initializeWithValue?: boolean;
}

export function useMediaQuery(
     query: string,
     { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {}
): boolean {
     const [matches, setMatches] = useState<boolean>(() => {
          if (initializeWithValue && typeof window !== 'undefined') {
               return window.matchMedia(query).matches;
          }
          return defaultValue;
     });

     useEffect(() => {
          if (typeof window === 'undefined') {
               return;
          }

          const mediaQueryList = window.matchMedia(query);
          const handleChange = (event: MediaQueryListEvent) => {
               setMatches(event.matches);
          };

          // Set initial value
          setMatches(mediaQueryList.matches);

          // Listen for changes
          mediaQueryList.addEventListener('change', handleChange);

          return () => {
               mediaQueryList.removeEventListener('change', handleChange);
          };
     }, [query]);

     return matches;
}

// Utility hooks for common breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
