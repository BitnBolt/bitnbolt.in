import records from '@/data/site-search-records.json';

export type SiteSearchRecord = {
  objectID: string;
  type: 'product' | 'service' | 'page' | 'faq';
  rankBoost: number;
  title: string;
  description: string;
  body: string;
  url: string;
  image?: string;
  category: string;
  tags: string[];
  brand?: string;
  slug?: string;
  finalPrice?: number;
  discount?: number;
  ratingAverage?: number;
  ratingCount?: number;
  stock?: number;
  isPublished?: boolean;
};

/** Services, pages, and FAQs — searchable alongside products. */
export const SITE_SEARCH_RECORDS = records as SiteSearchRecord[];
