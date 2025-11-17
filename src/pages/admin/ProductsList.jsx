// src/pages/admin/ProductsList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import AdminLayout from './AdminLayout';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductsList = () => {
  const theme = useThemeClasses();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Product deleted');
        setProducts(prev => prev.filter(p => p._id !== id));
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Network error');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className={`${theme.textMain} text-xl`}>Loading products...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className={`text-3xl font-bold ${theme.textMain}`}>Products</h1>
        <Link
          to="/admin/add-product"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
        >
          + Add Product
        </Link>
      </div>

      {/* Responsive Grid for Mobile, Table for Desktop */}
      <div className="block lg:hidden">
        {products.map((p) => (
          <div key={p._id} className={`${theme.cardBg} rounded-xl shadow-md p-5 mb-4 border ${theme.border}`}>
            <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className={`font-bold text-lg ${theme.textMain}`}>{p.name}</h3>
            <p className={`${theme.textSub} text-sm`}>{p.subCategory}</p>
            <p className={`font-medium mt-2 ${theme.textMain}`}>${p.variants[0]?.price.toLocaleString()}</p>
            <div className="flex justify-between mt-4">
              <Link to={`/admin/add-product?id=${p._id}`} className="text-purple-600 font-medium">Edit</Link>
              <button onClick={() => deleteProduct(p._id)} className="text-red-600 font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className={`${theme.cardBg} rounded-2xl shadow-xl overflow-hidden border ${theme.border}`}>
          <table className="w-full">
            <thead className={`${theme.hoverBg}`}>
              <tr>
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-4 text-left text-sm font-semibold ${theme.textSub} uppercase tracking-wider`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p._id} className={`${i % 2 === 0 ? theme.hoverBg : ''} hover:${theme.hoverBg} transition`}>
                  <td className="px-6 py-4">
                    <img src={p.image} alt="" className="h-14 w-14 object-cover rounded-lg" />
                  </td>
                  <td className={`px-6 py-4 font-medium ${theme.textMain}`}>{p.name}</td>
                  <td className={`px-6 py-4 ${theme.textSub}`}>{p.subCategory}</td>
                  <td className={`px-6 py-4 font-medium ${theme.textMain}`}> {p.variants[0]?.price.toLocaleString()}</td>
                  <td className={`px-6 py-4 ${theme.textMain}`}>
                    {p.variants.reduce((a, v) => a + v.stock, 0)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <Link to={`/admin/add-product?id=${p._id}`} className="text-purple-600 font-medium hover:underline">Edit</Link>
                      <button onClick={() => deleteProduct(p._id)} className="text-red-600 font-medium hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductsList;