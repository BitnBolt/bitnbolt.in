'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ALGOLIA_INDEX_NAME,
  hitHref,
  hitTitle,
  isAlgoliaConfigured,
  searchClient,
  typeLabel,
  type AlgoliaHit,
} from '@/lib/algolia';
import { useSearchOverlay } from '@/components/search/SearchProvider';

type Props = {
  isScrolled: boolean;
};

export default function HeaderSearch({ isScrolled }: Props) {
  const { openSearch } = useSearchOverlay();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<AlgoliaHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (!isAlgoliaConfigured) return;
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const { results } = await searchClient.search<AlgoliaHit>({
          requests: [
            {
              indexName: ALGOLIA_INDEX_NAME,
              query: q,
              hitsPerPage: 6,
            },
          ],
        });
        const first = results[0];
        if (!cancelled && first && 'hits' in first) {
          setHits(first.hits as AlgoliaHit[]);
          setOpen(true);
        }
      } catch (err) {
        console.error('Algolia header search failed:', err);
        if (!cancelled) setHits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  const showMore = (value?: string) => {
    const q = (value ?? query).trim();
    setOpen(false);
    openSearch(q);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 1) {
      showMore();
    } else {
      setOpen(false);
      openSearch('');
    }
  };

  return (
    <div ref={wrapRef} className="relative flex flex-1 min-w-0 max-w-sm sm:max-w-xl mx-1.5 sm:mx-6">
      <form
        onSubmit={onSubmit}
        className={`flex items-center rounded-full shadow-md sm:shadow-lg border sm:border-2 pl-1.5 sm:pl-2 w-full transition-colors outline-none ${
          isScrolled
            ? 'bg-white border-gray-300'
            : 'bg-white/10 border-white/20 backdrop-blur-sm'
        }`}
      >
        <input
          type="search"
          name="q"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (hits.length > 0 || query.trim().length >= 2) setOpen(true);
          }}
          placeholder="Search products & services..."
          className={`flex-1 min-w-0 px-2.5 py-1.5 sm:px-4 sm:py-2 text-sm bg-transparent border-0 rounded-full shadow-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-gray-400 ${
            isScrolled ? 'text-gray-900' : 'text-white'
          }`}
        />
        <button
          type="submit"
          className="ml-1 sm:ml-2 bg-[#1E88E5] text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-[#1976D2] transition-colors text-sm font-medium flex items-center gap-2 shrink-0 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          {loading && hits.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">Searching…</p>
          ) : hits.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">No matches. Click Search for full results.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {hits.map((hit) => {
                const title = hitTitle(hit);
                const href = hitHref(hit);
                return (
                  <li key={hit.objectID}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <span className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center text-[9px] font-bold uppercase text-gray-400">
                        {hit.image ? (
                          <Image src={hit.image} alt="" fill className="object-cover" sizes="40px" />
                        ) : (
                          typeLabel(hit.type).slice(0, 3)
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="block text-sm font-medium text-gray-900 truncate">{title}</span>
                          <span className="shrink-0 text-[10px] font-semibold uppercase text-[#1E88E5] bg-blue-50 px-1.5 py-0.5 rounded">
                            {typeLabel(hit.type)}
                          </span>
                        </span>
                        <span className="block text-xs text-gray-500 truncate">
                          {hit.type === 'product' && hit.finalPrice != null
                            ? `₹${Number(hit.finalPrice).toLocaleString('en-IN')}`
                            : hit.description || hit.category || typeLabel(hit.type)}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <button
            type="button"
            onClick={() => showMore()}
            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#1E88E5] bg-[#f8fafd] hover:bg-blue-50 border-t border-gray-100"
          >
            Show more results for “{query.trim()}”
          </button>
        </div>
      )}
    </div>
  );
}
