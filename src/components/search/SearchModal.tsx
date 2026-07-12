'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  InstantSearch,
  Configure,
  Hits,
  Highlight,
  Stats,
  useSearchBox,
  useRefinementList,
  useInstantSearch,
} from 'react-instantsearch';
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

function ModalSearchBox({ initialQuery }: { initialQuery: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, refine } = useSearchBox();

  useEffect(() => {
    refine(initialQuery);
  }, [initialQuery, refine]);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="relative">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder="Search products, PCB, firmware, pages…"
        className="w-full rounded-xl bg-white border border-gray-200 text-[#0B1C2D] placeholder:text-gray-400 pl-10 pr-4 py-3 text-sm sm:text-base outline-none focus:border-[#1E88E5] shadow-sm"
      />
    </div>
  );
}

function TypePills() {
  const { items, refine } = useRefinementList({ attribute: 'type' });
  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => refine(item.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
            item.isRefined
              ? 'bg-[#1E88E5] text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1E88E5] hover:text-[#1E88E5]'
          }`}
        >
          {item.label} <span className="opacity-70">({item.count})</span>
        </button>
      ))}
    </div>
  );
}

function HitRow({ hit }: { hit: AlgoliaHit }) {
  const { closeSearch } = useSearchOverlay();
  const href = hitHref(hit);
  const title = hitTitle(hit);
  const isProduct = hit.type === 'product';

  return (
    <Link
      href={href}
      onClick={closeSearch}
      className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 hover:bg-[#f8fafd] border-b border-gray-100 last:border-b-0 transition-colors"
    >
      <span className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {hit.image ? (
          <Image src={hit.image} alt="" fill className="object-cover" sizes="56px" />
        ) : (
          <span className="text-[10px] font-bold uppercase text-[#1E88E5]">{typeLabel(hit.type).slice(0, 3)}</span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#1E88E5]">
            {typeLabel(hit.type)}
          </span>
          {hit.category ? (
            <span className="text-[10px] text-gray-400 truncate">{hit.category}</span>
          ) : null}
        </span>
        <span className="block text-sm sm:text-base font-semibold text-[#0B1C2D] truncate">
          <Highlight
            attribute="title"
            hit={hit as never}
            classNames={{ highlighted: 'bg-blue-100 not-italic text-[#0B1C2D]' }}
          />
        </span>
        {hit.description ? (
          <span className="hidden sm:block text-xs text-gray-500 line-clamp-1 mt-0.5">
            <Highlight
              attribute="description"
              hit={hit as never}
              classNames={{ highlighted: 'bg-blue-50 not-italic' }}
            />
          </span>
        ) : null}
      </span>
      <span className="shrink-0 text-right">
        {isProduct && hit.finalPrice != null ? (
          <span className="block text-sm font-bold text-[#0B1C2D]">
            ₹{Number(hit.finalPrice).toLocaleString('en-IN')}
          </span>
        ) : (
          <span className="text-xs font-semibold text-[#1E88E5]">Open →</span>
        )}
      </span>
    </Link>
  );
}

function ResultsBody() {
  const { results, status } = useInstantSearch();
  const loading = status === 'loading' || status === 'stalled';

  if (loading && !results?.hits?.length) {
    return <p className="px-4 py-10 text-sm text-gray-500 text-center">Searching…</p>;
  }

  if (results && results.nbHits === 0) {
    return (
      <div className="px-4 py-16 text-center text-sm text-gray-500 min-h-full flex flex-col items-center justify-center">
        <p className="mb-3">No matches for this query.</p>
        <p className="text-xs text-gray-400">Try PCB, firmware, IoT kit, or a product name.</p>
      </div>
    );
  }

  return (
    <Hits
      hitComponent={HitRow as never}
      classNames={{
        list: 'divide-y-0',
        item: 'list-none',
      }}
    />
  );
}

function SearchPanel({ initialQuery }: { initialQuery: string }) {
  const { closeSearch } = useSearchOverlay();

  if (!isAlgoliaConfigured) {
    return (
      <div className="p-6 text-sm text-amber-900 bg-amber-50">
        <p className="font-semibold mb-1">Algolia is not configured</p>
        <p className="font-light">Add keys to .env.local and run npm run sync-algolia.</p>
        <button type="button" onClick={closeSearch} className="mt-4 text-[#1E88E5] font-semibold underline">
          Close
        </button>
      </div>
    );
  }

  return (
    <InstantSearch
      key={initialQuery}
      searchClient={searchClient}
      indexName={ALGOLIA_INDEX_NAME}
      initialUiState={{
        [ALGOLIA_INDEX_NAME]: { query: initialQuery },
      }}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <div className="flex flex-col h-full min-h-0">
        <Configure hitsPerPage={20} />

        <div className="bg-white px-4 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] sm:text-xs tracking-[0.18em] uppercase text-[#1E88E5] font-semibold">
                BitnBolt
              </p>
              <p className="text-[#0B1C2D] text-lg sm:text-xl font-bold tracking-tight">More results</p>
            </div>
            <button
              type="button"
              onClick={closeSearch}
              className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xl leading-none"
              aria-label="Close search"
            >
              ×
            </button>
          </div>
          <ModalSearchBox initialQuery={initialQuery} />
        </div>

        <div className="bg-[#f8fafd] px-4 sm:px-6 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-h-[52px] shrink-0">
          <TypePills />
          <Stats classNames={{ root: 'text-xs text-gray-500 shrink-0' }} />
        </div>

        <div className="bg-white flex-1 min-h-0 overflow-y-auto">
          <ResultsBody />
        </div>

        <div className="bg-[#f8fafd] border-t border-gray-100 px-4 sm:px-6 py-3 text-[11px] sm:text-xs text-gray-400 shrink-0">
          Products rank first when they match · Esc to close
        </div>
      </div>
    </InstantSearch>
  );
}

export default function SearchModal() {
  const { isOpen, query, closeSearch } = useSearchOverlay();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        aria-label="Close search overlay"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={closeSearch}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="More search results"
        className="relative z-10 w-full sm:max-w-3xl lg:max-w-4xl h-[min(85dvh,680px)] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white flex flex-col"
      >
        <SearchPanel initialQuery={query} />
      </div>
    </div>
  );
}
