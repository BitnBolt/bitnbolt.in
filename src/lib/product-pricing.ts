/**
 * Customer price = base × (1 + margin%) × (1 − discount%).
 * Must stay strictly above vendor base so marketplace margin never goes negative.
 */

export function priceWithMargin(basePrice: number, profitMargin: number): number {
  return roundMoney(basePrice * (1 + profitMargin / 100));
}

export function calculateFinalPrice(
  basePrice: number,
  profitMargin: number,
  discount: number
): number {
  const margined = basePrice * (1 + profitMargin / 100);
  return roundMoney(margined * (1 - discount / 100));
}

/** Max discount % that still keeps finalPrice > basePrice (exclusive). */
export function maxDiscountForMargin(profitMargin: number): number {
  if (profitMargin <= 0) return 0;
  // base*(1+m/100)*(1-d/100) > base  =>  d < 100*m/(100+m)
  const max = (100 * profitMargin) / (100 + profitMargin);
  // leave a tiny buffer so we never land on equality after rounding
  return Math.max(0, Math.floor((max - 0.01) * 100) / 100);
}

export function isValidCustomerPrice(
  basePrice: number,
  profitMargin: number,
  discount: number
): boolean {
  if (basePrice < 0 || profitMargin < 0 || discount < 0 || discount > 100) {
    return false;
  }
  return calculateFinalPrice(basePrice, profitMargin, discount) > basePrice;
}

export function validatePricingOrThrow(
  basePrice: number,
  profitMargin: number,
  discount: number
): number {
  const finalPrice = calculateFinalPrice(basePrice, profitMargin, discount);
  if (!(finalPrice > basePrice)) {
    const maxDiscount = maxDiscountForMargin(profitMargin);
    throw new Error(
      `Final price (₹${finalPrice}) must be greater than base (₹${basePrice}). ` +
        `With ${profitMargin}% margin, discount cannot exceed ${maxDiscount}%.`
    );
  }
  return finalPrice;
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}
