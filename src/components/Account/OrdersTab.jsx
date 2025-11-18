// src/components/account/OrdersTab.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ChevronRight } from 'lucide-react';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_BASE_URL;

const OrdersTab = ({ user }) => {
  const theme = useThemeClasses();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      console.log('hey')
      try {
        const res = await fetch(`${API}/api/orders`, {
          credentials: 'include',
        });
        const data = await res.json();
        console.log(data)
        if (res.ok) {
          // Filter out soft-deleted orders
          const activeOrders = (data.orders || []).filter(order => !order.isDeleted);
          setOrders(activeOrders);
        } else {
          toast.error(data.message || 'Failed to load orders');
        }
      } catch {
        toast.error('Network error');
      } finally {
        setLoading(false);
      }
    };
    
    if (user?._id) fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <p className={`text-center py-12 ${theme.textSub}`}>
        No orders yet. <Link to="/shop" className={theme.accent}>Start shopping!</Link>
      </p>
    );
  }

  return (
    <div className={`space-y-6 ${theme.cardBg}`}>
      {orders.map(order => (
        <div key={order._id} className={`p-5 rounded-lg border ${theme.border} ${theme.hoverBg}`}>
          <div className="flex flex-wrap justify-between items-start mb-3">
            <div>
              <p className={`font-semibold ${theme.textMain}`}>Order #{order._id.slice(-6)}</p>
              <p className={`text-sm ${theme.textMuted}`}>
                {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${order.status === 'delivered' ? theme.success : theme.accent}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
              <p className={`text-sm ${order.paymentStatus === 'succeeded' ? theme.success : theme.danger}`}>
                Payment: {order.paymentStatus}
              </p>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={theme.textSub}>
                  {item.productId.name || 'Product'} x{item.quantity}
                </span>
                <span className={`ml-auto ${theme.textMain} font-medium`}>${item.price}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <p className={`font-bold ${theme.textMain}`}>Total: ${(order.totalAmount).toFixed(2)}</p>
            <Link
              to={`/order/${order._id}`}
              className={`flex items-center gap-1 text-sm ${theme.accent} hover:underline`}
            >
              View Details <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersTab;