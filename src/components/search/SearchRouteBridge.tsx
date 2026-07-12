'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchOverlay } from '@/components/search/SearchProvider';

/** Opens the search popup when visiting /search?query=… */
export default function SearchRouteBridge({ initialQuery = '' }: { initialQuery?: string }) {
  const { openSearch, isOpen } = useSearchOverlay();
  const router = useRouter();
  const opened = useRef(false);
  const wasOpen = useRef(false);

  useEffect(() => {
    openSearch(initialQuery);
    opened.current = true;
  }, [initialQuery, openSearch]);

  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true;
      return;
    }
    // Only redirect home after the modal was open and then closed
    if (opened.current && wasOpen.current) {
      router.replace('/');
    }
  }, [isOpen, router]);

  return null;
}
