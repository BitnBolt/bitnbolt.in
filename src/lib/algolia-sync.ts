import { algoliasearch } from 'algoliasearch';
import type { IProduct } from '@/models/Products';
import { ALGOLIA_INDEX_NAME } from '@/lib/algolia';
import { SITE_SEARCH_RECORDS, type SiteSearchRecord } from '@/lib/search-content';

export type { SiteSearchRecord };
export type AlgoliaProductRecord = SiteSearchRecord & {
  type: 'product';
  rankBoost: 100;
};

type ProductLike = Partial<IProduct> & {
  _id: { toString(): string } | string;
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  brand?: string;
  tags?: string[];
  images?: string[];
  finalPrice?: number;
  discount?: number;
  rating?: { average?: number; count?: number };
  stock?: number;
  isPublished?: boolean;
  isSuspended?: boolean;
  isFeatured?: boolean;
};

function getAdminClient() {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
  if (!appId || !adminKey) {
    return null;
  }
  return algoliasearch(appId, adminKey);
}

export function toAlgoliaProductRecord(product: ProductLike): AlgoliaProductRecord {
  const id = String(product._id);
  return {
    objectID: id.startsWith('product:') ? id : `product:${id}`,
    type: 'product',
    rankBoost: product.isFeatured ? 150 : 100,
    title: product.name || '',
    description: product.description || '',
    body: [
      product.name,
      product.brand,
      product.category,
      ...(Array.isArray(product.tags) ? product.tags : []),
      product.description,
    ]
      .filter(Boolean)
      .join(' '),
    url: `/product/${product.slug || id.replace(/^product:/, '')}`,
    image: product.images?.[0] || '',
    category: product.category || 'Product',
    brand: product.brand || '',
    tags: Array.isArray(product.tags) ? product.tags : [],
    slug: product.slug || '',
    finalPrice: Number(product.finalPrice) || 0,
    discount: Number(product.discount) || 0,
    ratingAverage: Number(product.rating?.average) || 0,
    ratingCount: Number(product.rating?.count) || 0,
    stock: Number(product.stock) || 0,
    isPublished: Boolean(product.isPublished),
    isFeatured: Boolean(product.isFeatured),
  };
}

export function productObjectId(productId: string) {
  const id = String(productId);
  return id.startsWith('product:') ? id : `product:${id}`;
}

export async function saveProductToAlgolia(product: ProductLike) {
  const client = getAdminClient();
  if (!client) return { skipped: true as const };

  await client.saveObjects({
    indexName: ALGOLIA_INDEX_NAME,
    objects: [toAlgoliaProductRecord(product)],
  });
  return { skipped: false as const };
}

export async function removeProductFromAlgolia(productId: string) {
  const client = getAdminClient();
  if (!client) return { skipped: true as const };

  const objectID = productObjectId(productId);
  // Also remove legacy unprefixed Mongo id if it exists
  await client.deleteObjects({
    indexName: ALGOLIA_INDEX_NAME,
    objectIDs: [objectID, String(productId).replace(/^product:/, '')],
  });
  return { skipped: false as const };
}

/** Index when published & not suspended; otherwise remove. */
export async function syncProductToAlgolia(product: ProductLike) {
  try {
    if (product.isPublished && !product.isSuspended) {
      return await saveProductToAlgolia(product);
    }
    return await removeProductFromAlgolia(String(product._id));
  } catch (error) {
    console.error('Algolia sync failed:', error);
    return { skipped: false as const, error: true as const };
  }
}

export const ALGOLIA_INDEX_SETTINGS = {
  searchableAttributes: [
    'unordered(title)',
    'unordered(name)',
    'unordered(tags)',
    'unordered(category)',
    'unordered(brand)',
    'unordered(description)',
    'unordered(body)',
  ],
  attributesForFaceting: [
    'searchable(type)',
    'searchable(category)',
    'searchable(brand)',
    'filterOnly(isPublished)',
  ],
  // Products (rankBoost 100) rise above services/pages when relevance is close
  customRanking: ['desc(rankBoost)', 'desc(ratingAverage)', 'desc(ratingCount)'],
  attributesToRetrieve: [
    'objectID',
    'type',
    'rankBoost',
    'title',
    'name',
    'description',
    'body',
    'url',
    'image',
    'category',
    'brand',
    'tags',
    'slug',
    'finalPrice',
    'discount',
    'ratingAverage',
    'ratingCount',
    'stock',
    'isPublished',
    'isFeatured',
  ],
};

export async function configureAlgoliaIndex() {
  const client = getAdminClient();
  if (!client) throw new Error('Algolia admin credentials missing');

  await client.setSettings({
    indexName: ALGOLIA_INDEX_NAME,
    indexSettings: ALGOLIA_INDEX_SETTINGS,
  });
}

export async function saveSiteContentToAlgolia(records: SiteSearchRecord[] = SITE_SEARCH_RECORDS) {
  const client = getAdminClient();
  if (!client) return { skipped: true as const };

  await client.saveObjects({
    indexName: ALGOLIA_INDEX_NAME,
    objects: records,
  });
  return { skipped: false as const };
}
