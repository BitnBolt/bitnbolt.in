/** Fields that encode BitnBolt marketplace markup — never expose to vendors. */
const VENDOR_HIDDEN_PRODUCT_FIELDS = ['profitMargin', 'discount', 'finalPrice'] as const;

type PlainObject = Record<string, unknown>;

function toPlain(doc: unknown): PlainObject {
  if (doc == null || typeof doc !== 'object') {
    return {};
  }
  if ('toObject' in doc && typeof (doc as { toObject: (opts?: object) => PlainObject }).toObject === 'function') {
    try {
      return (doc as { toObject: (opts?: object) => PlainObject }).toObject({
        depopulate: false,
        flattenMaps: true,
      });
    } catch {
      // fall through
    }
  }
  try {
    return JSON.parse(JSON.stringify(doc)) as PlainObject;
  } catch {
    return { ...(doc as PlainObject) };
  }
}

export function sanitizeProductForVendor(product: unknown) {
  const plain = toPlain(product);
  for (const field of VENDOR_HIDDEN_PRODUCT_FIELDS) {
    delete plain[field];
  }
  return plain;
}

/**
 * Return only fields vendors need on line items.
 * Never expose margin / discount / customer finalPrice.
 */
export function sanitizeOrderItemForVendor(item: unknown) {
  const plain = toPlain(item);

  let productId: unknown = plain.productId;
  if (productId && typeof productId === 'object') {
    const productPlain = toPlain(productId);
    productId = {
      _id: productPlain._id,
      name: productPlain.name || 'Product',
      images: Array.isArray(productPlain.images) ? productPlain.images : [],
      slug: productPlain.slug || '',
      description: productPlain.description,
    };
  }

  let vendorId: unknown = plain.vendorId;
  if (vendorId && typeof vendorId === 'object' && vendorId !== null && '_id' in vendorId) {
    vendorId = (vendorId as { _id: unknown })._id;
  }

  return {
    productId,
    vendorId,
    quantity: Number(plain.quantity) || 0,
    basePrice: Number(plain.basePrice) || 0,
  };
}

export function vendorIdOfItem(item: { vendorId?: unknown }): string {
  const v = item.vendorId;
  if (v && typeof v === 'object' && v !== null && '_id' in v) {
    return String((v as { _id: unknown })._id);
  }
  return String(v ?? '');
}
