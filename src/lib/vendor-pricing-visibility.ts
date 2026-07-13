/** Fields that encode BitnBolt marketplace markup — never expose to vendors. */
const VENDOR_HIDDEN_PRODUCT_FIELDS = ['profitMargin', 'discount', 'finalPrice'] as const;

type PlainObject = Record<string, unknown>;

function toPlain(doc: unknown): PlainObject {
  if (doc && typeof doc === 'object' && 'toObject' in doc && typeof (doc as { toObject: () => PlainObject }).toObject === 'function') {
    return (doc as { toObject: () => PlainObject }).toObject();
  }
  return { ...(doc as PlainObject) };
}

export function sanitizeProductForVendor(product: unknown) {
  const plain = toPlain(product);
  for (const field of VENDOR_HIDDEN_PRODUCT_FIELDS) {
    delete plain[field];
  }
  return plain;
}

export function sanitizeOrderItemForVendor(item: unknown) {
  const plain = toPlain(item);
  delete plain.profitMargin;
  delete plain.discount;
  delete plain.finalPrice;
  return plain;
}
