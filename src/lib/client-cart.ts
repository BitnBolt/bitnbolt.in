import {
  clearGuestCart,
  getGuestCart,
  notifyCartUpdated,
  removeGuestCartItem,
  upsertGuestCartItem,
} from '@/lib/guest-cart';

export type ClientCartProduct = {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  finalPrice: number;
  basePrice?: number;
  rating?: number;
  category?: string;
  stock?: number;
};

export type ClientCartItem = {
  productId: string;
  quantity: number;
  product: ClientCartProduct;
};

async function resolveProductId(productRef: string): Promise<string> {
  // Already an ObjectId-looking value — still resolve via API if needed for slug safety
  const res = await fetch(`/api/products/${encodeURIComponent(productRef)}`);
  if (!res.ok) {
    throw new Error('Product not found');
  }
  const product = (await res.json()) as { _id: string };
  return String(product._id);
}

async function fetchServerCart(): Promise<ClientCartItem[]> {
  const res = await fetch('/api/cart');
  if (res.status === 401) return [];
  if (!res.ok) throw new Error('Failed to load cart');
  const data = (await res.json()) as { items?: ClientCartItem[] };
  const byId = new Map<string, ClientCartItem>();
  for (const it of data.items || []) {
    const key = String(it.productId);
    if (!byId.has(key)) {
      byId.set(key, {
        productId: key,
        quantity: it.quantity,
        product: {
          ...it.product,
          _id: String(it.product._id),
        },
      });
    }
  }
  return Array.from(byId.values());
}

async function fetchGuestCartDetailed(): Promise<ClientCartItem[]> {
  const guest = getGuestCart();
  if (guest.length === 0) return [];

  const res = await fetch('/api/cart/resolve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: guest }),
  });
  if (!res.ok) throw new Error('Failed to load cart');
  const data = (await res.json()) as { items?: ClientCartItem[] };
  return (data.items || []).map((it) => ({
    productId: String(it.productId),
    quantity: it.quantity,
    product: { ...it.product, _id: String(it.product._id) },
  }));
}

export async function getCartItems(isAuthenticated: boolean): Promise<ClientCartItem[]> {
  if (isAuthenticated) {
    return fetchServerCart();
  }
  return fetchGuestCartDetailed();
}

export async function addToCart(
  productRef: string,
  quantity: number,
  isAuthenticated: boolean,
): Promise<void> {
  const qty = Math.max(1, Math.floor(quantity || 1));

  if (isAuthenticated) {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: productRef, quantity: qty }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error((j as { message?: string }).message || 'Failed to add to cart');
    }
  } else {
    const productId = await resolveProductId(productRef);
    const existing = getGuestCart().find((e) => e.productId === productId);
    upsertGuestCartItem(productId, (existing?.quantity || 0) + qty);
  }

  notifyCartUpdated();
}

export async function setCartQuantity(
  productRef: string,
  quantity: number,
  isAuthenticated: boolean,
): Promise<void> {
  const qty = Math.max(0, Math.floor(quantity));

  if (isAuthenticated) {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: productRef, quantity: qty }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error((j as { message?: string }).message || 'Failed to update cart');
    }
  } else {
    const productId = await resolveProductId(productRef);
    if (qty <= 0) removeGuestCartItem(productId);
    else upsertGuestCartItem(productId, qty);
  }

  notifyCartUpdated();
}

export async function removeFromCart(
  productRef: string,
  isAuthenticated: boolean,
): Promise<void> {
  if (isAuthenticated) {
    const res = await fetch(`/api/cart/${encodeURIComponent(productRef)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error((j as { message?: string }).message || 'Failed to remove item');
    }
  } else {
    const productId = await resolveProductId(productRef).catch(() => productRef);
    removeGuestCartItem(productId);
  }

  notifyCartUpdated();
}

/** Push local guest cart into the authenticated server cart, then clear local. */
export async function mergeGuestCartToServer(): Promise<boolean> {
  const guest = getGuestCart();
  if (guest.length === 0) return false;

  for (const entry of guest) {
    // Read current server qty and add guest qty
    const serverItems = await fetchServerCart();
    const existing = serverItems.find((it) => it.productId === entry.productId);
    const nextQty = (existing?.quantity || 0) + entry.quantity;
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: entry.productId, quantity: nextQty }),
    });
    if (!res.ok) {
      throw new Error('Failed to merge guest cart');
    }
  }

  clearGuestCart();
  notifyCartUpdated();
  return true;
}

export function getCartUnitCount(items: ClientCartItem[]) {
  return items.reduce((sum, it) => sum + (it.quantity || 0), 0);
}
