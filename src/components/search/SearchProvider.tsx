'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type SearchContextValue = {
  isOpen: boolean;
  query: string;
  openSearch: (query?: string) => void;
  closeSearch: () => void;
  setQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const openSearch = useCallback((q = '') => {
    setQuery(q);
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const value = useMemo(
    () => ({ isOpen, query, openSearch, closeSearch, setQuery }),
    [isOpen, query, openSearch, closeSearch],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearchOverlay() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('useSearchOverlay must be used within SearchProvider');
  }
  return ctx;
}
