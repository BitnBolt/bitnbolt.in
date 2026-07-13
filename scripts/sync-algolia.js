/**
 * Full site-wide Algolia reindex: services + pages + FAQs + published products.
 *
 * Usage:
 *   npm run sync-algolia
 *
 * Products get rankBoost 100 (150 if featured) so they rank above services when both match.
 */

const path = require('path');
const mongoose = require('mongoose');
const { algoliasearch } = require('algoliasearch');

const MONGODB_URI = process.env.MONGODB_URI;
const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_API_KEY;
const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'bitnbolt';

if (!MONGODB_URI || !APP_ID || !ADMIN_KEY) {
  console.error('Missing MONGODB_URI, NEXT_PUBLIC_ALGOLIA_APP_ID, or ALGOLIA_ADMIN_API_KEY');
  process.exit(1);
}

const siteRecords = require(path.join(__dirname, '../src/data/site-search-records.json'));

const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

function toProductRecord(doc) {
  const id = String(doc._id);
  const isFeatured = Boolean(doc.isFeatured);
  return {
    objectID: `product:${id}`,
    type: 'product',
    rankBoost: isFeatured ? 150 : 100,
    title: doc.name || '',
    description: doc.description || '',
    body: [doc.name, doc.brand, doc.category, ...(Array.isArray(doc.tags) ? doc.tags : []), doc.description]
      .filter(Boolean)
      .join(' '),
    url: `/product/${doc.slug || id}`,
    image: Array.isArray(doc.images) && doc.images[0] ? doc.images[0] : '',
    category: doc.category || 'Product',
    brand: doc.brand || '',
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    slug: doc.slug || '',
    finalPrice: Number(doc.finalPrice) || 0,
    discount: Number(doc.discount) || 0,
    ratingAverage: Number(doc.rating?.average) || 0,
    ratingCount: Number(doc.rating?.count) || 0,
    stock: Number(doc.stock) || 0,
    isPublished: Boolean(doc.isPublished),
    isFeatured,
  };
}

async function main() {
  console.log('Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI);

  const products = await Product.find({
    isPublished: true,
    isSuspended: { $ne: true },
  }).lean();

  console.log(`Found ${products.length} published products`);
  console.log(`Found ${siteRecords.length} site content records (services / pages / FAQs)`);

  const client = algoliasearch(APP_ID, ADMIN_KEY);

  console.log(`Configuring index "${INDEX_NAME}"…`);
  await client.setSettings({
    indexName: INDEX_NAME,
    indexSettings: {
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
    },
  });

  console.log('Clearing existing objects…');
  await client.clearObjects({ indexName: INDEX_NAME });

  const objects = [...siteRecords, ...products.map(toProductRecord)];
  console.log(`Uploading ${objects.length} records…`);
  await client.saveObjects({
    indexName: INDEX_NAME,
    objects,
    waitForTasks: true,
  });

  console.log('Algolia site-wide sync complete.');
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
