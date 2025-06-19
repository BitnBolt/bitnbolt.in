'use client'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useState } from 'react';

const dummyCart = [
  {
    id: 1,
    name: 'IoT Smart Sensor',
    price: 199,
    quantity: 2,
  },
  {
    id: 3,
    name: 'Smart Home Hub',
    price: 299,
    quantity: 1,
  },
];

const subtotal = dummyCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const estimatedTax = Math.round(subtotal * 0.08 * 100) / 100;
const shipping = subtotal > 500 ? 0 : 20;
const total = subtotal + estimatedTax + shipping;

export default function CheckoutPage() {
  const [payment, setPayment] = useState('card');
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });
  const handleAddressChange = e => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <section className="py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Shipping & Payment */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-8">
            {/* Shipping Address */}
            <div>
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={address.name} onChange={handleAddressChange} placeholder="Full Name" className="px-4 py-3 border border-gray-300 rounded" />
                <input name="phone" value={address.phone} onChange={handleAddressChange} placeholder="Phone Number" className="px-4 py-3 border border-gray-300 rounded" />
                <input name="street" value={address.street} onChange={handleAddressChange} placeholder="Street Address" className="px-4 py-3 border border-gray-300 rounded md:col-span-2" />
                <input name="city" value={address.city} onChange={handleAddressChange} placeholder="City" className="px-4 py-3 border border-gray-300 rounded" />
                <input name="state" value={address.state} onChange={handleAddressChange} placeholder="State" className="px-4 py-3 border border-gray-300 rounded" />
                <input name="zip" value={address.zip} onChange={handleAddressChange} placeholder="ZIP Code" className="px-4 py-3 border border-gray-300 rounded md:col-span-2" />
              </form>
            </div>
            {/* Payment Options */}
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" value="card" checked={payment === 'card'} onChange={() => setPayment('card')} />
                  Credit/Debit Card
                </label>
                {payment === 'card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <input placeholder="Card Number" className="px-4 py-3 border border-gray-300 rounded" />
                    <input placeholder="Name on Card" className="px-4 py-3 border border-gray-300 rounded" />
                    <input placeholder="Expiry (MM/YY)" className="px-4 py-3 border border-gray-300 rounded" />
                    <input placeholder="CVV" className="px-4 py-3 border border-gray-300 rounded" />
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" value="upi" checked={payment === 'upi'} onChange={() => setPayment('upi')} />
                  UPI
                </label>
                {payment === 'upi' && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <input placeholder="UPI ID (e.g. name@bank)" className="px-4 py-3 border border-gray-300 rounded w-full" />
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" value="paypal" checked={payment === 'paypal'} onChange={() => setPayment('paypal')} />
                  PayPal
                </label>
                {payment === 'paypal' && (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                    You will be redirected to PayPal to complete your purchase.
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Right: Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-6">
            <h3 className="text-xl font-bold mb-2">Order Summary</h3>
            <ul className="mb-4 divide-y divide-gray-200">
              {dummyCart.map(item => (
                <li key={item.id} className="py-2 flex items-center justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-semibold text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
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
            <button className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors w-full mt-2">Place Order</button>
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