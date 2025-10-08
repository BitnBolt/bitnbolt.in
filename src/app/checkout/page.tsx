'use client'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [payment, setPayment] = useState('cod');
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });
  const [billingAddress, setBillingAddress] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch cart items and user profile
  useEffect(() => {
    if (session?.user?.id) {
      fetchCart();
      fetchUserProfile();
    }
  }, [session]);

  // Recalculate delivery cost when payment method changes
  useEffect(() => {
    if (shippingAddress.pincode && shippingAddress.pincode.length === 6 && items.length > 0) {
      calculateDeliveryCost(shippingAddress.pincode);
    }
  }, [payment]);

  // Calculate delivery cost when items are loaded and we have a pincode
  useEffect(() => {
    if (shippingAddress.pincode && shippingAddress.pincode.length === 6 && items.length > 0 && !deliveryCost) {
      calculateDeliveryCost(shippingAddress.pincode);
    }
  }, [items, shippingAddress.pincode]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Failed to load cart');
      const data = await res.json() as { items: CartItem[] };
      // Deduplicate on productId, using server-provided quantity (same as cart page)
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

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (!res.ok) return; // Don't show error for profile fetch failure
      
      const data = await res.json();
      setProfileLoaded(true);
      
      // Auto-fill shipping address if user has saved address
      if (data.deliveryAddress && data.deliveryAddress.street) {
        const newAddress = {
          fullName: session?.user?.name || '',
          phoneNumber: data.phoneNumber || '',
          addressLine1: data.deliveryAddress.street || '',
          addressLine2: '',
          city: data.deliveryAddress.city || '',
          state: data.deliveryAddress.state || '',
          pincode: data.deliveryAddress.postalCode || '',
          landmark: '',
        };
        
        setShippingAddress(newAddress);
        
        // Calculate delivery cost if pincode is available
        if (newAddress.pincode && newAddress.pincode.length === 6) {
          calculateDeliveryCost(newAddress.pincode);
        }
        
        // Show a brief success message
        setError(null);
      }
    } catch (e) {
      // Silently fail - don't show error for profile fetch
      console.log('Could not fetch user profile for auto-fill');
      setProfileLoaded(true);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'shipping' | 'billing') => {
    const value = e.target.value;
    if (type === 'shipping') {
      setShippingAddress({ ...shippingAddress, [e.target.name]: value });
      
      // Calculate delivery cost when pincode changes
      if (e.target.name === 'pincode' && value.length === 6) {
        calculateDeliveryCost(value);
      }
    } else {
      setBillingAddress({ ...billingAddress, [e.target.name]: value });
    }
  };

  const calculateDeliveryCost = async (pincode: string) => {
    if (!pincode || pincode.length !== 6 || items.length === 0) return;
    
    try {
      setDeliveryLoading(true);
      const res = await fetch('/api/checkout/delivery-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryPincode: pincode,
          paymentMethod: payment,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDeliveryCost(data.totalShippingCost);
      } else {
        setDeliveryCost(null);
      }
    } catch (error) {
      console.error('Failed to calculate delivery cost:', error);
      setDeliveryCost(null);
    } finally {
      setDeliveryLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!shippingAddress.fullName || !shippingAddress.phoneNumber || 
          !shippingAddress.addressLine1 || !shippingAddress.city || 
          !shippingAddress.state || !shippingAddress.pincode) {
        setError('Please fill in all required shipping address fields');
        return;
      }

      if (!useSameAddress && (!billingAddress.fullName || !billingAddress.phoneNumber || 
          !billingAddress.addressLine1 || !billingAddress.city || 
          !billingAddress.state || !billingAddress.pincode)) {
        setError('Please fill in all required billing address fields');
        return;
      }

      const checkoutData = {
        shippingAddress,
        billingAddress: useSameAddress ? shippingAddress : billingAddress,
        paymentMethod: payment,
        useSameAddress,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Checkout failed');
      }

      if (payment === 'online' && data.razorpayOrder) {
        // Handle Razorpay payment
        const options = {
          key: data.razorpayOrder.key,
          amount: data.razorpayOrder.amount,
          currency: data.razorpayOrder.currency,
          name: 'BitnBolt',
          description: 'Order Payment',
          order_id: data.razorpayOrder.id,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: data.orderId,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok) {
                router.push(`/orders/${data.orderId}?success=true`);
              } else {
                // If payment verification fails, restore stock
                try {
                  await fetch('/api/payment/failed', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId: data.orderId }),
                  });
                } catch (error) {
                  console.error('Failed to handle payment verification failure:', error);
                }
                setError(verifyData.message || 'Payment verification failed. Stock has been restored.');
              }
            } catch (error) {
              setError('Payment verification failed');
            }
          },
          prefill: {
            name: session?.user?.name || '',
            email: session?.user?.email || '',
          },
          theme: {
            color: '#2563eb',
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.on('payment.failed', async function (response: any) {
          try {
            // Call API to restore stock and mark order as cancelled
            await fetch('/api/payment/failed', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: data.orderId }),
            });
          } catch (error) {
            console.error('Failed to handle payment failure:', error);
          }
          setError('Payment failed. Stock has been restored. Please try again.');
        });
        razorpay.open();
      } else {
        // COD order
        router.push(`/orders/${data.orderId}?success=true`);
      }
    } catch (e: any) {
      setError(e?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };


  const { subtotal, estimatedTax, shipping, total } = (() => {
    const st = items.reduce((sum, it) => sum + it.product.finalPrice * it.quantity, 0);
    const tax = Math.round(st * 0.18 * 100) / 100; // 18% GST
    // Always use calculated delivery cost from Shiprocket, fallback to 0 if not calculated yet
    const ship = deliveryCost !== null ? deliveryCost : 0;
    return { subtotal: st, estimatedTax: tax, shipping: ship, total: st + tax + ship };
  })();

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">Loading...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <section className="py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Shipping & Payment */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Shipping Address */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Shipping Address</h2>
                {profileLoaded && (
                  <button
                    type="button"
                    onClick={async () => {
                      await fetchUserProfile();
                      // Recalculate delivery cost if pincode is available
                      if (shippingAddress.pincode && shippingAddress.pincode.length === 6) {
                        calculateDeliveryCost(shippingAddress.pincode);
                      }
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Use Saved Address
                  </button>
                )}
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  name="fullName" 
                  value={shippingAddress.fullName} 
                  onChange={(e) => handleAddressChange(e, 'shipping')} 
                  placeholder="Full Name *" 
                  className="px-4 py-3 border border-gray-300 rounded" 
                  required 
                />
                <input 
                  name="phoneNumber" 
                  value={shippingAddress.phoneNumber} 
                  onChange={(e) => handleAddressChange(e, 'shipping')} 
                  placeholder="Phone Number *" 
                  className="px-4 py-3 border border-gray-300 rounded" 
                  required 
                />
                <input 
                  name="addressLine1" 
                  value={shippingAddress.addressLine1} 
                  onChange={(e) => handleAddressChange(e, 'shipping')} 
                  placeholder="Street Address *" 
                  className="px-4 py-3 border border-gray-300 rounded md:col-span-2" 
                  required 
                />
                <input 
                  name="addressLine2" 
                  value={shippingAddress.addressLine2} 
                  onChange={(e) => handleAddressChange(e, 'shipping')} 
                  placeholder="Address Line 2" 
                  className="px-4 py-3 border border-gray-300 rounded md:col-span-2" 
                />
                <input 
                  name="city" 
                  value={shippingAddress.city} 
                  onChange={(e) => handleAddressChange(e, 'shipping')} 
                  placeholder="City *" 
                  className="px-4 py-3 border border-gray-300 rounded" 
                  required 
                />
                <input 
                  name="state" 
                  value={shippingAddress.state} 
                  onChange={(e) => handleAddressChange(e, 'shipping')} 
                  placeholder="State *" 
                  className="px-4 py-3 border border-gray-300 rounded" 
                  required 
                />
                <input 
                  name="pincode" 
                  value={shippingAddress.pincode} 
                  onChange={(e) => handleAddressChange(e, 'shipping')} 
                  placeholder="Pincode *" 
                  className="px-4 py-3 border border-gray-300 rounded" 
                  required 
                />
                <input 
                  name="landmark" 
                  value={shippingAddress.landmark} 
                  onChange={(e) => handleAddressChange(e, 'shipping')} 
                  placeholder="Landmark" 
                  className="px-4 py-3 border border-gray-300 rounded" 
                />
              </form>
            </div>

            {/* Billing Address */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <input 
                  type="checkbox" 
                  id="sameAddress" 
                  checked={useSameAddress} 
                  onChange={(e) => setUseSameAddress(e.target.checked)} 
                />
                <label htmlFor="sameAddress" className="text-sm">Use same address for billing</label>
              </div>
              
              {!useSameAddress && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Billing Address</h2>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      name="fullName" 
                      value={billingAddress.fullName} 
                      onChange={(e) => handleAddressChange(e, 'billing')} 
                      placeholder="Full Name *" 
                      className="px-4 py-3 border border-gray-300 rounded" 
                      required 
                    />
                    <input 
                      name="phoneNumber" 
                      value={billingAddress.phoneNumber} 
                      onChange={(e) => handleAddressChange(e, 'billing')} 
                      placeholder="Phone Number *" 
                      className="px-4 py-3 border border-gray-300 rounded" 
                      required 
                    />
                    <input 
                      name="addressLine1" 
                      value={billingAddress.addressLine1} 
                      onChange={(e) => handleAddressChange(e, 'billing')} 
                      placeholder="Street Address *" 
                      className="px-4 py-3 border border-gray-300 rounded md:col-span-2" 
                      required 
                    />
                    <input 
                      name="addressLine2" 
                      value={billingAddress.addressLine2} 
                      onChange={(e) => handleAddressChange(e, 'billing')} 
                      placeholder="Address Line 2" 
                      className="px-4 py-3 border border-gray-300 rounded md:col-span-2" 
                    />
                    <input 
                      name="city" 
                      value={billingAddress.city} 
                      onChange={(e) => handleAddressChange(e, 'billing')} 
                      placeholder="City *" 
                      className="px-4 py-3 border border-gray-300 rounded" 
                      required 
                    />
                    <input 
                      name="state" 
                      value={billingAddress.state} 
                      onChange={(e) => handleAddressChange(e, 'billing')} 
                      placeholder="State *" 
                      className="px-4 py-3 border border-gray-300 rounded" 
                      required 
                    />
                    <input 
                      name="pincode" 
                      value={billingAddress.pincode} 
                      onChange={(e) => handleAddressChange(e, 'billing')} 
                      placeholder="Pincode *" 
                      className="px-4 py-3 border border-gray-300 rounded" 
                      required 
                    />
                    <input 
                      name="landmark" 
                      value={billingAddress.landmark} 
                      onChange={(e) => handleAddressChange(e, 'billing')} 
                      placeholder="Landmark" 
                      className="px-4 py-3 border border-gray-300 rounded" 
                    />
              </form>
            </div>
              )}
            </div>

            {/* Payment Options */}
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={payment === 'cod'} 
                    onChange={() => setPayment('cod')} 
                    className="w-4 h-4" 
                  />
                  <div>
                    <div className="font-medium">Cash on Delivery (COD)</div>
                    <div className="text-sm text-gray-500">Pay when your order is delivered</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="online" 
                    checked={payment === 'online'} 
                    onChange={() => setPayment('online')} 
                    className="w-4 h-4" 
                  />
                  <div>
                    <div className="font-medium">Online Payment</div>
                    <div className="text-sm text-gray-500">Pay securely with Razorpay (Cards, UPI, Net Banking)</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-6">
            <h3 className="text-xl font-bold mb-2">Order Summary</h3>
            
            {loading ? (
              <div className="text-gray-500">Loading cart...</div>
            ) : items.length === 0 ? (
              <div className="text-gray-500">Your cart is empty</div>
            ) : (
              <>
            <ul className="mb-4 divide-y divide-gray-200">
                  {items.map(item => (
                    <li key={item.productId} className="py-3 flex items-center gap-3">
                      <Image 
                        src={item.product.images?.[0] || '/next.svg'} 
                        alt={item.product.name} 
                        width={50} 
                        height={50} 
                        className="rounded object-cover" 
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.product.name}</div>
                        <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                      </div>
                      <span className="font-semibold text-blue-600">₹{(item.product.finalPrice * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
                
            <div className="flex items-center justify-between text-base">
              <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-base">
                  <span>GST (18%)</span>
                  <span>₹{estimatedTax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span>Shipping</span>
              <span>
                {deliveryLoading ? (
                  <span className="text-gray-500">Calculating...</span>
                ) : deliveryCost !== null ? (
                  `₹${shipping.toFixed(2)}`
                ) : (
                  <span className="text-gray-500">Enter pincode to calculate</span>
                )}
              </span>
            </div>
            {deliveryCost !== null && deliveryCost > 0 && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <p>✓ Real-time shipping cost calculated</p>
                <p>✓ Multiple vendors supported</p>
              </div>
            )}
            <div className="border-t pt-4 flex items-center justify-between text-lg font-bold">
              <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
            </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0 || deliveryCost === null}
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors w-full mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : deliveryCost === null ? 'Calculate Shipping First' : 'Place Order'}
                </button>
                
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                  <p>Real-time shipping costs calculated by Shiprocket.</p>
              <p className="mt-1 text-gray-500">30-day returns • Secure checkout • 24/7 support</p>
            </div>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
} 