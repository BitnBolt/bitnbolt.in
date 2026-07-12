export type GuestCartEntry = {
  productId: string;
  quantity: number;
};

const GUEST_CART_KEY = 'bitnbolt_guest_cart';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getGuestCart(): GuestCartEntry[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestCartEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e) => e?.productId && Number(e.quantity) > 0)
      .map((e) => ({
        productId: String(e.productId),
        quantity: Math.max(1, Math.floor(Number(e.quantity) || 1)),
      }));
  } catch {
    return [];
  }
}

export function setGuestCart(items: GuestCartEntry[]) {
  if (!canUseStorage()) return;
  const cleaned = items
    .filter((e) => e?.productId && Number(e.quantity) > 0)
    .map((e) => ({
      productId: String(e.productId),
      quantity: Math.max(1, Math.floor(Number(e.quantity) || 1)),
    }));
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cleaned));
}

export function clearGuestCart() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(GUEST_CART_KEY);
}

export function upsertGuestCartItem(productId: string, quantity: number) {
  const id = String(productId);
  const qty = Math.max(0, Math.floor(quantity));
  const items = getGuestCart().filter((e) => e.productId !== id);
  if (qty > 0) {
    items.push({ productId: id, quantity: qty });
  }
  setGuestCart(items);
  return items;
}

export function removeGuestCartItem(productId: string) {
  const items = getGuestCart().filter((e) => e.productId !== String(productId));
  setGuestCart(items);
  return items;
}

export function getGuestCartCount() {
  return getGuestCart().reduce((sum, e) => sum + e.quantity, 0);
}

export function notifyCartUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }
}
