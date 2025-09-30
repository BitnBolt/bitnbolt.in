'use client'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type CartItem = {
  productId: string;
  quantity: number;
  product: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
    finalPrice: number;
  };
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Failed to load cart');
      const data = await res.json() as { items: CartItem[] };
      // Deduplicate on productId, using server-provided quantity
      const byId = new Map<string, CartItem>();
      for (const it of data.items || []) {
        const key = it.productId;
        if (!byId.has(key)) byId.set(key, it);
      }
      setItems(Array.from(byId.values()));
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId: string, qty: number) => {
    qty = Math.max(1, Math.floor(qty));
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: qty })
    });
    await fetchCart();
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  const removeItem = async (productId: string) => {
    await fetch(`/api/cart/${productId}`, { method: 'DELETE' });
    await fetchCart();
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  const { subtotal, estimatedTax, shipping, total } = useMemo(() => {
    const st = items.reduce((sum, it) => sum + it.product.finalPrice * it.quantity, 0);
    const tax = Math.round(st * 0.08 * 100) / 100;
    const ship = st > 500 ? 0 : 20;
    return { subtotal: st, estimatedTax: tax, shipping: ship, total: st + tax + ship };
  }, [items]);

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <section className="py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Products */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
            {loading ? (
              <div className="text-gray-500">Loading…</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : items.length === 0 ? (
              <div className="text-gray-500">Your cart is empty.</div>
            ) : (
              <ul className="space-y-6">
                {items.map(item => (
                  <li key={item.productId} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                    <Image src={item.product.images?.[0] || '/next.svg'} alt={item.product.name} width={80} height={80} className="rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">{item.product.name}</div>
                      <div className="text-blue-600 font-bold text-base mb-2">${item.product.finalPrice.toFixed(2)}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Qty:</span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuantity(item.productId, Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded"
                        />
                        <button
                          className="ml-2 text-red-500 hover:underline text-sm"
                          onClick={() => removeItem(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Checkout Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-6">
            <h3 className="text-xl font-bold mb-2">Order Summary</h3>
            <div className="flex items-center justify-between text-base">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span>Estimated Tax (8%)</span>
              <span>${estimatedTax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="border-t pt-4 flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors w-full mt-2">Proceed to Checkout</button>
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
              <p>Free delivery on orders over $500.</p>
              <p className="mt-1 text-gray-500">30-day returns • Secure checkout • 24/7 support</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
} 