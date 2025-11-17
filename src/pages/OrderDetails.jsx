import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Navbar from '../components/Navbar'
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  MapPin,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                               SKELETON COMPONENT                           */
/* -------------------------------------------------------------------------- */
const OrderSkeleton = ({ darkMode }) => {
  const bg = darkMode ? 'bg-gray-800' : 'bg-white';
  const skeleton = darkMode ? 'bg-gray-700' : 'bg-gray-200';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <>
    
    
    <div className="max-w-5xl mx-auto animate-pulse space-y-6">
      
      <div className={`rounded-t-lg ${bg} p-6 border-b ${border}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className={`h-7 w-48 ${skeleton} rounded`}></div>
            <div className={`h-5 w-36 mt-2 ${skeleton} rounded`}></div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-6 w-6 ${skeleton} rounded-full`}></div>
            <div className={`h-5 w-24 ${skeleton} rounded`}></div>
          </div>
        </div>
      </div>

      <div className={`rounded-b-lg ${bg} border ${border} overflow-hidden`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className={`h-6 w-32 ${skeleton} rounded`}></div>
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`flex gap-4 p-4 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-20 h-20 ${skeleton} rounded-md`}></div>
                <div className="flex-1 space-y-2">
                  <div className={`h-5 w-40 ${skeleton} rounded`}></div>
                  <div className={`h-4 w-24 ${skeleton} rounded`}></div>
                  <div className={`h-4 w-20 ${skeleton} rounded`}></div>
                </div>
                <div className="text-right space-y-1">
                  <div className={`h-5 w-16 ${skeleton} rounded`}></div>
                  <div className={`h-4 w-12 ${skeleton} rounded`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment */}
            <div>
              <div className={`h-6 w-24 ${skeleton} rounded mb-3`}></div>
              <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`h-4 w-16 ${skeleton} rounded mb-1`}></div>
                <div className={`h-5 w-28 ${skeleton} rounded mb-3`}></div>
                <div className={`h-4 w-14 ${skeleton} rounded mb-1`}></div>
                <div className={`h-5 w-20 ${skeleton} rounded`}></div>
              </div>
            </div>

            {/* Shipping */}
            <div>
              <div className={`h-6 w-36 ${skeleton} rounded mb-3`}></div>
              <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`h-4 w-full ${skeleton} rounded mb-1`}></div>
                <div className={`h-4 w-3/4 ${skeleton} rounded`}></div>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className={`h-6 w-28 ${skeleton} rounded mb-3`}></div>
              <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className={`h-4 w-16 ${skeleton} rounded`}></div>
                    <div className={`h-4 w-12 ${skeleton} rounded`}></div>
                  </div>
                  <div className="flex justify-between">
                    <div className={`h-4 w-10 ${skeleton} rounded`}></div>
                    <div className={`h-4 w-20 ${skeleton} rounded`}></div>
                  </div>
                  <div className={`pt-2 border-t ${border} flex justify-between`}>
                    <div className={`h-5 w-12 ${skeleton} rounded`}></div>
                    <div className={`h-5 w-16 ${skeleton} rounded`}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`h-10 w-full ${skeleton} rounded-lg`}></div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*                              MAIN PAGE COMPONENT                           */
/* -------------------------------------------------------------------------- */
const OrderDetailsPage = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const { isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      // ---- ALWAYS start fresh ----
      setOrder(null);
      setError(null);
      setLoading(true);

      if (!isAuthenticated) {
        setError('Please log in to view your order.');
        setLoading(false);
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
          credentials: 'include',
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.msg || 'Failed to fetch order');
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated]);

  /* ---------------------------------------------------------------------- */
  /*                              STATUS ICON                               */
  /* ---------------------------------------------------------------------- */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="text-yellow-500" size={20} />;
      case 'shipped':
        return <Truck className="text-blue-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                              THEME HELPERS                              */
  /* ---------------------------------------------------------------------- */
  const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const text = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';

  /* ---------------------------------------------------------------------- */
  /*                              RENDER LOGIC                               */
  /* ---------------------------------------------------------------------- */

  // 1. Still loading → show skeleton
  if (loading) {
    return (
      <div className={`min-h-screen ${bg} py-8 px-4 sm:px-6 lg:px-8`}>
        <OrderSkeleton darkMode={darkMode} />
      </div>
    );
  }

  // 2. Error (or no order) → show error card
  if (error || !order) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center p-4`}>
        <div className={`max-w-md w-full p-6 rounded-lg shadow-lg ${card}`}>
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <XCircle size={28} />
            <h2 className="text-xl font-bold">Order Not Found</h2>
          </div>
          <p className={textMuted}>
            {error || 'This order does not exist or you do not have access.'}
          </p>
          <Link
            to="/orders"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  // 3. Success → render real order
  return (
    <>
    <Navbar/>
    <div className={`min-h-screen ${bg} py-8 px-4 sm:px-6 lg:px-8`}>
      
      <div className="max-w-5xl mx-auto my-12">
        {/* Header */}
        <div className={`rounded-t-lg ${card} p-6 border-b ${border}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-bold ${text}`}>Order #{order._id}</h1>
              <p className={textMuted}>
                Placed on {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy • h:mm a') : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span
                className={`font-medium capitalize ${
                  order.status === 'delivered'
                    ? 'text-green-500'
                    : order.status === 'cancelled'
                    ? 'text-red-500'
                    : 'text-yellow-600'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className={`rounded-b-lg ${card} border ${border} overflow-hidden`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Items */}
            <div className="lg:col-span-2">
              <h2 className={`text-lg font-semibold mb-4 ${text}`}>Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-4 p-4 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {item.productId?.image ? (
                        <img
                          src={item.productId.image}
                          alt={item.productId.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-md w-20 h-20 flex items-center justify-center">
                          <Package size={28} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${text}`}>
                        {item.productId?.name || 'Unknown Product'}
                      </h3>
                      <p className={textMuted}>Size: {item.size || 'N/A'}</p>
                      <p className={textMuted}>Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${text}`}>${item.price * item.quantity}</p>
                      <p className={`text-sm ${textMuted}`}>${item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${text}`}>
                  <CreditCard size={20} />
                  Payment
                </h3>
                <div
                  className={`p-4 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <p className={textMuted}>Method</p>
                  <p className={`capitalize font-medium ${text}`}>{order.paymentMethod}</p>
                  <p className={`${textMuted} mt-2`}>Status</p>
                  <p
                    className={`capitalize font-medium ${
                      order.paymentStatus === 'succeeded'
                        ? 'text-green-500'
                        : order.paymentStatus === 'failed'
                        ? 'text-red-500'
                        : 'text-yellow-600'
                    }`}
                  >
                    {order.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Shipping */}
              {order.shippingAddress && (
                <div>
                  <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${text}`}>
                    <MapPin size={20} />
                    Shipping Address
                  </h3>
                  <div
                    className={`p-4 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <p className={`${text} whitespace-pre-line`}>{order.shippingAddress}</p>
                  </div>
                </div>
              )}

              {/* Price */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${text}`}>Price Breakdown</h3>
                <div
                  className={`p-4 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={textMuted}>Subtotal</span>
                      <span className={text}>${order.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={textMuted}>Tax</span>
                      <span className={text}>Calculated at checkout</span>
                    </div>
                    <div className={`pt-2 border-t ${border} flex justify-between font-bold text-lg`}>
                      <span className={text}>Total</span>
                      <span className={text}>${order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/account"
                className="w-full block text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Go Back
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className={`text-center mt-8 ${textMuted} text-sm`}>
          Need help? Contact support at{' '}
          <a href="mailto:support@yourstore.com" className="text-blue-500 hover:underline">
            support@yourstore.com
          </a>
        </p>
      </div>
    </div>
    </>
  );
  
};

export default OrderDetailsPage;