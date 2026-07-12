'use client'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CartSkeleton from '@/components/skeletons/CartSkeleton';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PAGE_TOP } from '@/lib/layout';
import {
  getCartItems,
  removeFromCart,
  setCartQuantity,
  type ClientCartItem,
} from '@/lib/client-cart';

export default function CartPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<ClientCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  const isAuthenticated = status === 'authenticated';

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      if (status === 'loading') return;
      const data = await getCartItems(isAuthenticated);
      setItems(data);
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Something went wrong');
    } finally {
      setLoading(false);
      isInitialLoad.current = false;
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const updateQuantity = async (productId: string, qty: number) => {
    qty = Math.max(1, Math.floor(qty));
    await setCartQuantity(productId, qty, isAuthenticated);
    await fetchCart();
  };

  const removeItem = async (productId: string) => {
    await removeFromCart(productId, isAuthenticated);
    await fetchCart();
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent('/checkout')}`);
      return;
    }
    router.push('/checkout');
  };

  const { subtotal, estimatedTax, total } = useMemo(() => {
    const st = items.reduce((sum, it) => sum + it.product.finalPrice * it.quantity, 0);
    const tax = Math.round(st * 0.18 * 100) / 100;
    return { subtotal: st, estimatedTax: tax, total: st + tax };
  }, [items]);

  return (
    <main className="min-h-screen bg-gray-100">
      <Header forceWhite />
      {loading && isInitialLoad.current ? (
        <CartSkeleton />
      ) : (
      <section className={`${PAGE_TOP} pb-8 sm:pb-10 px-4`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {/* Cart Products */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Shopping Cart</h2>
            {error ? (
              <div className="text-red-600 text-sm sm:text-base">{error}</div>
            ) : items.length === 0 ? (
              <div className="text-gray-500 text-sm sm:text-base">Your cart is empty.</div>
            ) : (
              <ul className="space-y-4 sm:space-y-6">
                {items.map(item => (
                  <li key={item.productId} className="flex items-start sm:items-center gap-3 sm:gap-4 border-b pb-3 sm:pb-4 last:border-b-0 last:pb-0">
                    <Image src={item.product.images?.[0] || '/next.svg'} alt={item.product.name} width={80} height={80} className="rounded-lg object-cover w-16 h-16 sm:w-20 sm:h-20 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm sm:text-lg line-clamp-2">{item.product.name}</div>
                      <div className="text-blue-600 font-bold text-sm sm:text-base mb-1.5 sm:mb-2">₹{item.product.finalPrice.toFixed(2)}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm text-gray-600">Qty:</span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuantity(item.productId, Number(e.target.value))}
                          className="w-14 sm:w-16 px-2 py-1.5 sm:py-1 border border-gray-300 rounded text-sm"
                        />
                        <button
                          className="ml-1 sm:ml-2 text-red-500 hover:underline text-xs sm:text-sm"
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
            <h3 className="text-lg sm:text-xl font-bold mb-0 sm:mb-2">Order Summary</h3>
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span>Estimated Tax (18%)</span>
              <span>₹{estimatedTax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 sm:pt-4 flex items-center justify-between text-base sm:text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="bg-teal-600 text-white px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-lg hover:bg-teal-700 transition-colors w-full mt-1 sm:mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
            </button>
            {!isAuthenticated && items.length > 0 && (
              <p className="text-xs sm:text-sm text-gray-500 text-center">
                Your cart is saved on this device. Sign in when you&apos;re ready to checkout.
              </p>
            )}
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-blue-700">
              <p>Free delivery on orders over ₹500.</p>
              <p className="mt-1 text-gray-500 hidden sm:block">30-day returns • Secure checkout • 24/7 support</p>
            </div>
          </div>
        </div>
      </section>
      )}
      <Footer />
    </main>
  );
}
