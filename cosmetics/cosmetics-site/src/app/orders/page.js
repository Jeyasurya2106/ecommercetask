'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchMyOrders, getUser } from '@/lib/api';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadOrders();
  }, []);

  const checkAuthAndLoadOrders = async () => {
    const user = getUser();
    if (!user) {
      router.push('/login?redirect=/orders');
      return;
    }

    loadOrders();
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const ordersList = await fetchMyOrders();
      // Sort by date, newest first
      if (Array.isArray(ordersList)) {
        ordersList.sort((a, b) => new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate));
        setOrders(ordersList);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'pending':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-600 mb-4">No orders yet</p>
          <p className="text-gray-500 mb-6">Start shopping and your orders will appear here</p>
          <Link
            href="/products"
            className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">{formatDate(order.createdAt || order.orderDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-teal-600 text-lg">₹{order.total_amount || order.total}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {(order.status || 'PENDING').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                {order.OrderItems && order.OrderItems.length > 0 ? (
                  <div className="space-y-3">
                    {order.OrderItems.map((orderItem, index) => (
                      <div key={index} className="flex items-center gap-4 pb-3 border-b last:border-b-0">
                        <div className="bg-gradient-to-br from-teal-50 to-green-50 w-16 h-16 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          🛍️
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">
                            {orderItem.Product?.name || orderItem.productName || 'Product'}
                          </h4>
                          <p className="text-sm text-gray-600">Quantity: {orderItem.quantity}</p>
                          <p className="text-sm text-gray-600">Price: ₹{orderItem.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-teal-600">₹{orderItem.price * orderItem.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No items found</p>
                )}

                {/* Order Actions */}
                <div className="mt-4 pt-4 border-t flex flex-wrap gap-3">
                  <button className="px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition font-semibold">
                    Track Order
                  </button>
                  <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    View Invoice
                  </button>
                  {order.status?.toLowerCase() === 'delivered' && (
                    <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      Reorder
                    </button>
                  )}
                </div>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Shipping Address:</p>
                    <p className="text-sm text-gray-600">{order.shipping_address}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back to Shopping */}
      {orders.length > 0 && (
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            ← Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}