import { liteClient as algoliasearch } from 'algoliasearch/lite';

export const ALGOLIA_INDEX_NAME =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'bitnbolt';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || '';

export const isAlgoliaConfigured = Boolean(appId && searchKey);

/** Browser-safe search client (Search-Only API key). */
export const searchClient = algoliasearch(appId || 'unused', searchKey || 'unused');

export type AlgoliaHitType = 'product' | 'service' | 'page' | 'faq';

/** Unified hit shape for products + services + pages + FAQs. */
export type AlgoliaHit = {
  objectID: string;
  type: AlgoliaHitType;
  rankBoost?: number;
  title: string;
  description?: string;
  body?: string;
  url: string;
  image?: string;
  category?: string;
  tags?: string[];
  brand?: string;
  slug?: string;
  finalPrice?: number;
  discount?: number;
  ratingAverage?: number;
  ratingCount?: number;
  stock?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  /** @deprecated prefer title — kept for older product-only records */
  name?: string;
};

export function hitTitle(hit: AlgoliaHit) {
  return hit.title || hit.name || 'Untitled';
}

export function hitHref(hit: AlgoliaHit) {
  if (hit.url) return hit.url;
  if (hit.type === 'product') {
    return `/product/${hit.slug || hit.objectID}`;
  }
  return '/';
}

export function typeLabel(type: AlgoliaHitType | string | undefined) {
  switch (type) {
    case 'product':
      return 'Product';
    case 'service':
      return 'Service';
    case 'faq':
      return 'Help';
    case 'page':
      return 'Page';
    default:
      return 'Result';
  }
}
