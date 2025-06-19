'use client'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';

const dummyOrders = [
  {
    id: 'ORD123456',
    date: '2024-05-01',
    status: 'Delivered',
    total: 697,
    products: [
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
    ],
  },
  {
    id: 'ORD123457',
    date: '2024-05-10',
    status: 'Shipped',
    total: 499,
    products: [
      {
        id: 2,
        name: 'Industrial Gateway',
        price: 499,
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
        quantity: 1,
      },
    ],
  },
  {
    id: 'ORD123458',
    date: '2024-05-15',
    status: 'Processing',
    total: 799,
    products: [
      {
        id: 4,
        name: 'Healthcare Monitor',
        price: 799,
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
        quantity: 1,
      },
    ],
  },
];

const statusColors: { [key: string]: string } = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <section className="py-10">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold mb-8">My Orders</h2>
          {dummyOrders.length === 0 ? (
            <div className="text-gray-500">You have no orders yet.</div>
          ) : (
            <ul className="space-y-8">
              {dummyOrders.map(order => (
                <li key={order.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <div className="flex flex-wrap gap-4 items-center">
                      <span className="font-semibold text-gray-900">Order #{order.id}</span>
                      <span className="text-gray-500">{order.date}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>{order.status}</span>
                    </div>
                    <div className="font-bold text-blue-600 text-lg">Total: ${order.total}</div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {order.products.map(product => (
                      <div key={product.id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                        <Image src={product.image} alt={product.name} width={60} height={60} className="rounded object-cover" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm">{product.name}</div>
                          <div className="text-gray-600 text-xs">Qty: {product.quantity}</div>
                          <div className="text-blue-600 font-bold text-base">${product.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
} 