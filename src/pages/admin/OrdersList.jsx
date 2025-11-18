// src/pages/admin/OrdersList.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import AdminLayout from './AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OrdersList = () => {
  const theme = useThemeClasses();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/admin/orders`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || 'Failed to load orders');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/admin/orders/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Order updated');
        setOrders(prev =>
          prev.map(o => (o._id === id ? { ...o, ...updates } : o))
        );
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch {
      toast.error('Network error');
    }
  };

  const handleStatusChange = (id, status) => {
    if (status === 'cancelled' && !window.confirm('Cancel this order?')) return;
    updateOrder(id, { status });
  };

  const handlePaymentChange = (id, paymentStatus) => {
    updateOrder(id, { paymentStatus });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-xl">Loading orders...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className={`text-3xl font-bold mb-8 ${theme.textMain}`}>Orders ({orders.length})</h1>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className={`${theme.textSub} text-center py-12`}>No orders yet.</p>
        ) : (
          orders.map(order => (
            <div
              key={order._id}
              className={`${theme.cardBg} rounded-xl shadow-lg p-6 border ${theme.border}`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <p className={`font-bold text-lg ${theme.textMain}`}>
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className={theme.textSub}>
                    {new Date(order.createdAt).toLocaleDateString()} • {order.user?.name || 'Guest'}
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {/* Order Status */}
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Payment Status */}
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentChange(order._id, e.target.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm ${
                      order.paymentStatus === 'succeeded'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="succeeded">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className={theme.textSub}>Payment Method</p>
                  <p className={`font-medium ${theme.textMain}`}>
                    {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card'}
                  </p>
                </div>
                <div>
                  <p className={theme.textSub}>Total Amount</p>
                  <p className={`font-bold text-lg ${theme.textMain}`}>
                    ${(order.totalAmount).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className={theme.textSub}>Items</p>
                  <p className={`font-medium ${theme.textMain}`}>{order.items.length}</p>
                </div>
              </div>

              {/* Items Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className={`text-sm font-medium mb-2 ${theme.textSub}`}>Items:</p>
                <div className="flex flex-wrap gap-3">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <img
                        src={item.productId?.image}
                        alt=""
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span className={theme.textMain}>
                        {item.productId?.name || 'Product'} × {item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <span className={`${theme.textSub} text-sm`}>+{order.items.length - 4} more</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersList;