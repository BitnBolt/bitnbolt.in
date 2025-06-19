'use client'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { useState } from 'react';

const dummyCart = [
  {
    id: 1,
    name: 'IoT Smart Sensor',
    price: 199,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    quantity: 2,
  },
  {
    id: 3,
    name: 'Smart Home Hub',
    price: 299,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
    quantity: 1,
  },
];

export default function CartPage() {
  const [cart, setCart] = useState(dummyCart);

  const updateQuantity = (id, qty) => {
    setCart(cart => cart.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };
  const removeItem = (id) => {
    setCart(cart => cart.filter(item => item.id !== id));
  };
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedTax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
  const shipping = subtotal > 500 ? 0 : 20;
  const total = subtotal + estimatedTax + shipping;

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <section className="py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Products */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
            {cart.length === 0 ? (
              <div className="text-gray-500">Your cart is empty.</div>
            ) : (
              <ul className="space-y-6">
                {cart.map(item => (
                  <li key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                    <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">{item.name}</div>
                      <div className="text-blue-600 font-bold text-base mb-2">${item.price}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Qty:</span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={e => updateQuantity(item.id, Math.max(1, Number(e.target.value)))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded"
                        />
                        <button
                          className="ml-2 text-red-500 hover:underline text-sm"
                          onClick={() => removeItem(item.id)}
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