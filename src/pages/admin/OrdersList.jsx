// // src/pages/admin/OrdersList.jsx
// import React, { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { useThemeClasses } from '../../hooks/useThemeClasses';
// import AdminLayout from './AdminLayout';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const OrdersList = () => {
//   const theme = useThemeClasses();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/orders/admin/orders`, {
//         credentials: 'include',
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setOrders(data.orders || []);
//       } else {
//         toast.error(data.message || 'Failed to load orders');
//       }
//     } catch {
//       toast.error('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };


//   const updateOrder = async (id, updates) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/orders/admin/orders/${id}`, {
//         method: 'PATCH',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updates),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         toast.success('Order updated');
//         setOrders(prev =>
//           prev.map(o => (o._id === id ? { ...o, ...updates } : o))
//         );
//       } else {
//         toast.error(data.message || 'Failed to update');
//       }
//     } catch {
//       toast.error('Network error');
//     }
//   };

//   const handleStatusChange = (id, status) => {
//     if (status === 'cancelled' && !window.confirm('Cancel this order?')) return;
//     updateOrder(id, { status });
//   };

//   const handlePaymentChange = (id, paymentStatus) => {
//     updateOrder(id, { paymentStatus });
//   };

//   if (loading) {
//     return (
//       <AdminLayout>
//         <div className="flex items-center justify-center h-64">
//           <p className="text-xl">Loading orders...</p>
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout>
//       <h1 className={`text-3xl font-bold mb-8 ${theme.textMain}`}>Orders ({orders.length})</h1>

//       <div className="space-y-6">
//         {orders.length === 0 ? (
//           <p className={`${theme.textSub} text-center py-12`}>No orders yet.</p>
//         ) : (
//           orders.map(order => (
//             <div
//               key={order._id}
//               className={`${theme.cardBg} rounded-xl shadow-lg p-6 border ${theme.border}`}
//             >
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
//                 <div>
//                   <p className={`font-bold text-lg ${theme.textMain}`}>
//                     Order #{order._id.slice(-6)}
//                   </p>
//                   <p className={theme.textSub}>
//                     {new Date(order.createdAt).toLocaleDateString()} • {order.user?.name || 'Guest'}
//                   </p>
//                 </div>

//                 <div className="flex gap-3 flex-wrap">
//                   {/* Order Status */}
//                   <select
//                     value={order.status}
//                     onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                     className={`px-4 py-2 rounded-lg font-medium text-sm ${
//                       order.status === 'delivered'
//                         ? 'bg-green-100 text-green-800'
//                         : order.status === 'cancelled'
//                         ? 'bg-red-100 text-red-800'
//                         : order.status === 'shipped'
//                         ? 'bg-blue-100 text-blue-800'
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}
//                   >
//                     <option value="processing">Processing</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="delivered">Delivered</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>

//                   {/* Payment Status */}
//                   <select
//                     value={order.paymentStatus}
//                     onChange={(e) => handlePaymentChange(order._id, e.target.value)}
//                     className={`px-4 py-2 rounded-lg font-medium text-sm ${
//                       order.paymentStatus === 'succeeded'
//                         ? 'bg-green-100 text-green-800'
//                         : order.paymentStatus === 'failed'
//                         ? 'bg-red-100 text-red-800'
//                         : 'bg-orange-100 text-orange-800'
//                     }`}
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="succeeded">Paid</option>
//                     <option value="failed">Failed</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                 <div>
//                   <p className={theme.textSub}>Payment Method</p>
//                   <p className={`font-medium ${theme.textMain}`}>
//                     {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card'}
//                   </p>
//                 </div>
//                 <div>
//                   <p className={theme.textSub}>Total Amount</p>
//                   <p className={`font-bold text-lg ${theme.textMain}`}>
//                     ${(order.totalAmount).toFixed(2)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className={theme.textSub}>Items</p>
//                   <p className={`font-medium ${theme.textMain}`}>{order.items.length}</p>
//                 </div>
//               </div>

//               {/* Items Preview */}
//               <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                 <p className={`text-sm font-medium mb-2 ${theme.textSub}`}>Items:</p>
//                 <div className="flex flex-wrap gap-3">
//                   {order.items.slice(0, 4).map((item, i) => (
//                     <div key={i} className="flex items-center gap-2 text-sm">
//                       <img
//                         src={item.productId?.image}
//                         alt=""
//                         className="w-10 h-10 object-cover rounded"
//                       />
//                       <span className={theme.textMain}>
//                         {item.productId?.name || 'Product'} × {item.quantity}
//                       </span>
//                     </div>
//                   ))}
//                   {order.items.length > 4 && (
//                     <span className={`${theme.textSub} text-sm`}>+{order.items.length - 4} more</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </AdminLayout>
//   );
// };

// export default OrdersList;





















// // src/pages/admin/OrdersList.jsx
// import React, { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { useThemeClasses } from '../../hooks/useThemeClasses';
// import AdminLayout from './AdminLayout';
// import { Search, Calendar, Filter } from 'lucide-react';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const OrdersList = () => {
//   const theme = useThemeClasses();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({});
  
//   // Filters
//   const [filters, setFilters] = useState({
//     search: '',
//     status: '',
//     paymentMethod: '',
//     paymentStatus: '',
//     startDate: '',
//     endDate: '',
//     page: 1,
//     limit: 10
//   });

//   useEffect(() => {
//     fetchOrders();
//   }, [filters]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       Object.keys(filters).forEach(key => {
//         if (filters[key]) params.append(key, filters[key]);
//       });

//       const res = await fetch(`${API_BASE_URL}/api/orders/admin/orders?${params}`, {
//         credentials: 'include',
//       });
//       const data = await res.json();
//       console.log(data)
//       if (res.ok) {
//         setOrders(data.orders || []);
//         setPagination(data.pagination || {});
//       } else {
//         toast.error(data.message || 'Failed to load orders');
//       }
//     } catch {
//       toast.error('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // reset to page 1
//   };

//   const updateOrder = async (id, updates) => {
//     // ... your existing updateOrder code ...
//   };

//   // ... handleStatusChange, handlePaymentChange ...

//   return (
//     <AdminLayout>
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <h1 className={`text-3xl font-bold ${theme.textMain}`}>Orders</h1>
//         <p className={theme.textSub}>{pagination.total || 0} total orders</p>
//       </div>

//       {/* Filters Bar */}
//       <div className={`${theme.cardBg} rounded-xl p-4 mb-6 border ${theme.border}`}>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by Order ID or Customer"
//               value={filters.search}
//               onChange={(e) => handleFilterChange('search', e.target.value)}
//               className={`w-full pl-10 pr-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
//             />
//           </div>

//           {/* Status */}
//           <select
//             value={filters.status}
//             onChange={(e) => handleFilterChange('status', e.target.value)}
//             className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
//           >
//             <option value="">All Status</option>
//             <option value="processing">Processing</option>
//             <option value="shipped">Shipped</option>
//             <option value="delivered">Delivered</option>
//             <option value="cancelled">Cancelled</option>
//           </select>

//           {/* Payment Method */}
//           <select
//             value={filters.paymentMethod}
//             onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
//             className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
//           >
//             <option value="">All Payment Methods</option>
//             <option value="card">Card</option>
//             <option value="cash">Cash on Delivery</option>
//           </select>

//           {/* Date Range */}
//           <div className="flex gap-2">
//             <input
//               type="date"
//               value={filters.startDate}
//               onChange={(e) => handleFilterChange('startDate', e.target.value)}
//               className={`px-3 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
//             />
//             <input
//               type="date"
//               value={filters.endDate}
//               onChange={(e) => handleFilterChange('endDate', e.target.value)}
//               className={`px-3 py-2 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain}`}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Orders List */}
//       {loading ? (
//         <div className="text-center py-12">Loading orders...</div>
//       ) : orders.length === 0 ? (
//         <p className={`${theme.textSub} text-center py-12`}>No orders found.</p>
//       ) : (
//         <>
//           <div className="space-y-6">
//             {orders.map(order => (
//               // ... your existing order card ...
//               <div
//               key={order._id}
//               className={`${theme.cardBg} rounded-xl shadow-lg p-6 border ${theme.border}`}
//             >
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
//                 <div>
//                   <p className={`font-bold text-lg ${theme.textMain}`}>
//                     Order #{order._id.slice(-6)}
//                   </p>
//                   <p className={theme.textSub}>
//                     {new Date(order.createdAt).toLocaleDateString()} • {order.user?.name || 'Guest'}
//                   </p>
//                 </div>

//                 <div className="flex gap-3 flex-wrap">
//                   {/* Order Status */}
//                   <select
//                     value={order.status}
//                     onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                     className={`px-4 py-2 rounded-lg font-medium text-sm ${
//                       order.status === 'delivered'
//                         ? 'bg-green-100 text-green-800'
//                         : order.status === 'cancelled'
//                         ? 'bg-red-100 text-red-800'
//                         : order.status === 'shipped'
//                         ? 'bg-blue-100 text-blue-800'
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}
//                   >
//                     <option value="processing">Processing</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="delivered">Delivered</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>

//                   {/* Payment Status */}
//                   <select
//                     value={order.paymentStatus}
//                     onChange={(e) => handlePaymentChange(order._id, e.target.value)}
//                     className={`px-4 py-2 rounded-lg font-medium text-sm ${
//                       order.paymentStatus === 'succeeded'
//                         ? 'bg-green-100 text-green-800'
//                         : order.paymentStatus === 'failed'
//                         ? 'bg-red-100 text-red-800'
//                         : 'bg-orange-100 text-orange-800'
//                     }`}
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="succeeded">Paid</option>
//                     <option value="failed">Failed</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                 <div>
//                   <p className={theme.textSub}>Payment Method</p>
//                   <p className={`font-medium ${theme.textMain}`}>
//                     {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card'}
//                   </p>
//                 </div>
//                 <div>
//                   <p className={theme.textSub}>Total Amount</p>
//                   <p className={`font-bold text-lg ${theme.textMain}`}>
//                     ${(order.totalAmount).toFixed(2)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className={theme.textSub}>Items</p>
//                   <p className={`font-medium ${theme.textMain}`}>{order.items.length}</p>
//                 </div>
//               </div>

//               {/* Items Preview */}
//               <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                 <p className={`text-sm font-medium mb-2 ${theme.textSub}`}>Items:</p>
//                 <div className="flex flex-wrap gap-3">
//                   {order.items.slice(0, 4).map((item, i) => (
//                     <div key={i} className="flex items-center gap-2 text-sm">
//                       <img
//                         src={item.productId?.image}
//                         alt=""
//                         className="w-10 h-10 object-cover rounded"
//                       />
//                       <span className={theme.textMain}>
//                         {item.productId?.name || 'Product'} × {item.quantity}
//                       </span>
//                     </div>
//                   ))}
//                   {order.items.length > 4 && (
//                     <span className={`${theme.textSub} text-sm`}>+{order.items.length - 4} more</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {pagination.pages > 1 && (
//             <div className="flex justify-center gap-2 mt-8">
//               <button
//                 disabled={!pagination.hasPrev}
//                 onClick={() => handleFilterChange('page', filters.page - 1)}
//                 className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <span className={`px-4 py-2 ${theme.textMain}`}>
//                 Page {filters.page} of {pagination.pages}
//               </span>
//               <button
//                 disabled={!pagination.hasNext}
//                 onClick={() => handleFilterChange('page', filters.page + 1)}
//                 className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </AdminLayout>
//   );
// };

// export default OrdersList;
























// src/pages/admin/OrdersList.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import AdminLayout from './AdminLayout';
import { Search, Calendar, ChevronDown, Filter } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OrdersList = () => {
  const theme = useThemeClasses();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false); // Mobile toggle

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    paymentMethod: '',
    paymentStatus: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await fetch(`${API_BASE_URL}/api/orders/admin/orders?${params}`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders || []);
        setPagination(data.pagination || {});
      } else {
        toast.error(data.message || 'Failed to load orders');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
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
        setOrders(prev => prev.map(o => o._id === id ? { ...o, ...updates } : o));
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch {
      toast.error('Network error');
    }
  };

  const handleStatusChange = (id, status) => {
    if (status === 'cancelled' && !window.confirm('Cancel this order? Stock will be restored.')) return;
    updateOrder(id, { status });
  };

  const handlePaymentChange = (id, paymentStatus) => {
    updateOrder(id, { paymentStatus });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className={`text-3xl font-bold ${theme.textMain}`}>Orders</h1>
        <div className="flex items-center gap-2">
          <p className={theme.textSub}>{pagination.total || 0} total</p>
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.border} ${theme.cardBg} ${theme.textMain}`}
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters Section - Responsive */}
      











<div className={`${theme.cardBg} rounded-xl border ${theme.border} p-2 mb-6 overflow-hidden transition-all duration-300 ${
        showFilters ? 'max-h-96' : 'md:max-h-96 max-h-0 md:p-4 p-0'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2">
          {/* Search */}
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Order ID or Customer"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={`px-4 py-2.5 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="">All Status</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Method */}
          <select
            value={filters.paymentMethod}
            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
            className={`px-4 py-2.5 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="">Payment Method</option>
            <option value="card">Card</option>
            <option value="cash">Cash on Delivery</option>
          </select>

          {/* Date Range - Stacked on Mobile */}
          <div className="flex flex-col sm:flex-row gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              {/* <Calendar className="w-5 h-5 text-gray-400" /> */}
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className={`flex-1 px-3 py-2.5 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className={`flex-1 px-3 py-2.5 rounded-lg border ${theme.border} ${theme.inputBg} ${theme.textMain} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
        </div>
      </div>


































      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : orders.length === 0 ? (
        <p className={`${theme.textSub} text-center py-16 text-xl`}>No orders found.</p>
      ) : (
        <>
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className={`${theme.cardBg} rounded-xl shadow-lg p-6 border ${theme.border} transition-all hover:shadow-xl`}>
                {/* Your existing order card content - unchanged */}
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
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handlePaymentChange(order._id, e.target.value)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        order.paymentStatus === 'succeeded' ? 'bg-green-100 text-green-800' :
                        order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="succeeded">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className={theme.textSub}>Payment Method</p>
                    <p className={`font-medium ${theme.textMain}`}>
                      {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card'}
                    </p>
                  </div>
                  <div>
                    <p className={theme.textSub}>Total Amount</p>
                    <p className={`font-bold text-xl ${theme.textMain}`}>
                      ${(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className={theme.textSub}>Items</p>
                    <p className={`font-medium ${theme.textMain}`}>{order.items.length}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className={`text-sm font-medium mb-3 ${theme.textSub}`}>Items:</p>
                  <div className="flex flex-wrap gap-4">
                    {order.items.slice(0, 5).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <img
                          src={item.productId?.image || '/placeholder.jpg'}
                          alt={item.productId?.name}
                          className="w-12 h-12 object-cover rounded-lg shadow"
                        />
                        <div>
                          <p className={`font-medium ${theme.textMain}`}>{item.productId?.name || 'Product'}</p>
                          <p className={theme.textSub}>× {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 5 && (
                      <span className={`${theme.textSub} text-sm self-center`}>+{order.items.length - 5} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                disabled={!pagination.hasPrev}
                onClick={() => handleFilterChange('page', filters.page - 1)}
                className="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Previous
              </button>
              <span className={`px-6 py-3 rounded-lg ${theme.cardBg} border ${theme.border} font-medium`}>
                Page {filters.page} of {pagination.pages}
              </span>
              <button
                disabled={!pagination.hasNext}
                onClick={() => handleFilterChange('page', filters.page + 1)}
                className="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default OrdersList;