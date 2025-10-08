'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Image from 'next/image';
// import Header from '../../components/Header';
// import Footer from '../../components/Footer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type OrderItem = {
  productId: {
    _id: string;
    name: string;
    images: string[];
    slug: string;
    description: string;
  } | null;
  vendorId: {
    _id: string;
    businessName: string;
    seller_name?: string;
    email: string;
    phone: string;
  } | null;
  quantity: number;
  basePrice: number;
  profitMargin: number;
  discount: number;
  finalPrice: number;
};

type Order = {
  _id: string;
  orderId: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  billingAddress: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  paymentDetails: {
    method: 'cod' | 'online';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paidAt?: Date;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  };
  orderSummary: {
    itemsTotal: number;
    shippingCharge: number;
    tax: number;
    totalAmount: number;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  statusHistory: Array<{
    status: string;
    comment?: string;
    updatedBy?: string;
    timestamp: Date;
  }>;
  deliveryDetails: {
    provider?: string;
    trackingId?: string;
    awbCode?: string;
    courierName?: string;
    shiprocketOrderId?: string;
    shiprocketShipmentId?: string;
    totalShippingCost?: number;
    vendorShipments?: Array<{
      vendorId: string;
      shiprocketOrderId?: string;
      shiprocketShipmentId?: string;
      awbCode?: string;
      courierName?: string;
      courierCompanyId?: string;
      shiprocketStatus?: string;
      createdAt?: Date;
      updatedAt?: Date;
    }>;
  };
  createdAt: Date;
};

export default function OrderDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch order details
  useEffect(() => {
    if (session?.user?.id && orderId) {
      fetchOrderDetails();
    }
  }, [session, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error('Failed to load order details');
      
      const data = await res.json();
      setOrder(data.order);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingData = async () => {
    if (!order?.deliveryDetails.awbCode) return;
    
    try {
      setLoadingTracking(true);
      const res = await fetch(`/api/shiprocket/track?awbCode=${order.deliveryDetails.awbCode}`);
      if (res.ok) {
        const data = await res.json();
        setTrackingData(data.tracking);
      }
    } catch (error) {
      console.error('Failed to fetch tracking data:', error);
    } finally {
      setLoadingTracking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Order Placed';
      case 'confirmed': return 'Order Confirmed';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'returned': return 'Returned';
      default: return status;
    }
  };

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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">Loading order details...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-gray-500 text-center">Order not found</div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-500">Order #{order.orderId}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Image
                        src={item.productId?.images?.[0] || '/next.svg'}
                        alt={item.productId?.name || 'Product'}
                        width={80}
                        height={80}
                        className="rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productId?.name || 'Product Unavailable'}</h3>
                        <p className="text-sm text-gray-500 mb-2">{item.productId?.description || 'Description not available'}</p>
                        <div className="flex gap-4 text-sm">
                          <span>Qty: {item.quantity}</span>
                          <span>Sold by: {item.vendorId?.businessName || item.vendorId?.seller_name || 'Vendor Unavailable'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">₹{(item.finalPrice * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-2">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  {order.shippingAddress.landmark && (
                    <p className="text-sm text-gray-500">Landmark: {order.shippingAddress.landmark}</p>
                  )}
                  <p className="text-sm text-gray-500">Phone: {order.shippingAddress.phoneNumber}</p>
                </div>
              </div>

              {/* Status History */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
                <div className="space-y-3">
                  {order.statusHistory.map((history, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(history.status).replace('bg-', 'bg-').replace('text-', '')}`}></div>
                      <div className="flex-1">
                        <p className="font-medium">{getStatusText(history.status)}</p>
                        {history.comment && <p className="text-sm text-gray-500">{history.comment}</p>}
                        {history.updatedBy && <p className="text-xs text-gray-400">Updated by: {history.updatedBy}</p>}
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(history.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Information */}
              {order.deliveryDetails.awbCode && (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Package Tracking</h2>
                    <button
                      onClick={fetchTrackingData}
                      disabled={loadingTracking}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loadingTracking ? 'Loading...' : 'Refresh Tracking'}
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>AWB Code:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{order.deliveryDetails.awbCode}</span>
                        <a
                          href={`/track/${order.deliveryDetails.awbCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          Track
                        </a>
                      </div>
                    </div>
                    {order.deliveryDetails.courierName && (
                      <div className="flex justify-between">
                        <span>Courier:</span>
                        <span className="font-medium">{order.deliveryDetails.courierName}</span>
                      </div>
                    )}
                  </div>

                  {trackingData && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Tracking Details</h3>
                      <div className="space-y-2">
                        {trackingData.tracking_data?.shipment_track?.map((track: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded">
                            <p className="font-medium">{track.status}</p>
                            <p className="text-sm text-gray-500">{track.location}</p>
                            <p className="text-xs text-gray-400">{track.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.orderSummary.itemsTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.orderSummary.shippingCharge === 0 ? 'Free' : `₹${order.orderSummary.shippingCharge.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST)</span>
                    <span>₹{order.orderSummary.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{order.orderSummary.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Method</span>
                    <span className="font-medium">{order.paymentDetails.method.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.paymentDetails.status)}`}>
                      {order.paymentDetails.status.charAt(0).toUpperCase() + order.paymentDetails.status.slice(1)}
                    </span>
                  </div>
                  {order.paymentDetails.transactionId && (
                    <div className="flex justify-between">
                      <span>Transaction ID</span>
                      <span className="text-sm font-mono">{order.paymentDetails.transactionId}</span>
                    </div>
                  )}
                  {order.paymentDetails.paidAt && (
                    <div className="flex justify-between">
                      <span>Paid At</span>
                      <span className="text-sm">{new Date(order.paymentDetails.paidAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Information */}
              {order.deliveryDetails.provider && (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Provider</span>
                      <span className="font-medium">{order.deliveryDetails.provider}</span>
                    </div>
                    {order.deliveryDetails.totalShippingCost && (
                      <div className="flex justify-between">
                        <span>Total Shipping Cost</span>
                        <span className="font-medium">₹{order.deliveryDetails.totalShippingCost.toFixed(2)}</span>
                      </div>
                    )}
                    {order.deliveryDetails.trackingId && (
                      <div className="flex justify-between">
                        <span>Tracking ID</span>
                        <span className="font-mono text-sm">{order.deliveryDetails.trackingId}</span>
                      </div>
                    )}
                    {order.deliveryDetails.awbCode && (
                      <div className="flex justify-between">
                        <span>AWB Code</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{order.deliveryDetails.awbCode}</span>
                          <a
                            href={`/track/${order.deliveryDetails.awbCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            Track
                          </a>
                        </div>
                      </div>
                    )}
                    {order.deliveryDetails.courierName && (
                      <div className="flex justify-between">
                        <span>Courier</span>
                        <span className="font-medium">{order.deliveryDetails.courierName}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Multi-vendor shipments */}
                  {order.deliveryDetails.vendorShipments && order.deliveryDetails.vendorShipments.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="font-medium mb-3">Vendor Shipments</h3>
                      <div className="space-y-3">
                        {order.deliveryDetails.vendorShipments.map((shipment: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium">Vendor Shipment #{index + 1}</p>
                                {shipment.shiprocketOrderId && (
                                  <p className="text-xs text-gray-600">Order ID: {shipment.shiprocketOrderId}</p>
                                )}
                                {shipment.awbCode && (
                                  <p className="text-xs text-gray-600">AWB: {shipment.awbCode}</p>
                                )}
                                {shipment.courierName && (
                                  <p className="text-xs text-gray-600">Courier: {shipment.courierName}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  shipment.shiprocketStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                  shipment.shiprocketStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  shipment.shiprocketStatus === 'created' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {shipment.shiprocketStatus?.charAt(0).toUpperCase() + shipment.shiprocketStatus?.slice(1) || 'Pending'}
                                </span>
                                {shipment.awbCode && (
                                  <a
                                    href={`/track/${shipment.awbCode}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                                  >
                                    Track
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

