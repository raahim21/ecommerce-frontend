// src/pages/Shop.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X, ChevronDown, Plus, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../data/categories';
import useDebounce from '../hooks/useDebounce'; // We'll create this
import ProductCard from '../components/ProductCard';
import { useCart } from '../hooks/useCart';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Shop() {
  const { darkMode } = useTheme();
  const { add } = useCart();

  // === Filters ===
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('newest');

  // === Pagination ===
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // === UI ===
  const [showFilters, setShowFilters] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // === Debounced values ===
  const debouncedSearch = useDebounce(search, 500);
  const debouncedPrice = useDebounce(priceRange, 600);

  // === Fetch Products ===
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
        sort: sortBy,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(category && { category }),
        ...(subCategory && { subCategory }),
        minPrice: debouncedPrice[0],
        maxPrice: debouncedPrice[1],
      });

      const res = await fetch(`${API_BASE_URL}/api/products?${params}`,{
          credentials: 'include', // sends cookies

      });
      if (!res.ok) throw new Error('Failed to load products');

      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, subCategory, debouncedPrice, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, subCategory, debouncedPrice, sortBy]);

  // === Products State ===
  const [products, setProducts] = useState([]);

  // === Add to Cart ===
  const handleAddToCart = async (product, variant) => {
    setAddingId(`${product._id}-${variant._id}`);
    try {
      add({
        productId: product._id,
        variantId: variant._id,
        name: product.name,
        image: product.image,
        subCategory: product.subCategory,
        size: variant.size,
        price: variant.price,
      });
    } finally {
      setAddingId(null);
    }
  };

  // === Subcategories based on selected category ===
  const availableSubCategories = useMemo(() => {
    if (!category) return [];
    const cat = CATEGORIES.find(c => c.name === category);
    return cat ? cat.sub : [];
  }, [category]);

  // === Theme ===
  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-900',
    sub: darkMode ? 'text-gray-400' : 'text-gray-600',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-50',
    accent: darkMode ? 'text-purple-400' : 'text-purple-600',
    button: darkMode
      ? 'bg-purple-600 hover:bg-purple-500'
      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
    inputBg: darkMode ? 'bg-gray-800' : 'bg-white',
    selectBg: darkMode ? 'bg-gray-700' : 'bg-gray-50',
  };

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold ${theme.text}`}>Shop All</h1>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-10 pr-4 py-2.5 w-full sm:w-64 rounded-xl border ${theme.border} ${theme.inputBg} ${theme.text} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${theme.border} ${theme.inputBg} ${theme.text} transition`}
            >
              <Filter size={18} />
              Filters
              <ChevronDown size={16} className={`transition ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className={`mb-8 p-6 rounded-2xl border ${theme.card} ${theme.border}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubCategory('');
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border ${theme.border} ${theme.selectBg} ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Subcategory</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!category}
                  className={`w-full px-4 py-2.5 rounded-xl border ${theme.border} ${theme.selectBg} ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50`}
                >
                  <option value="">All</option>
                  {availableSubCategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border ${theme.border} ${theme.selectBg} ${theme.text} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="mt-6">
              <label className={`block text-sm font-medium mb-3 ${theme.text}`}>
                Price: ${debouncedPrice[0]} - ${debouncedPrice[1]}
              </label>
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            <button
              onClick={() => {
                setSearch('');
                setCategory('');
                setSubCategory('');
                setPriceRange([0, 500]);
                setSortBy('newest');
              }}
              className="mt-4 text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <EmptyState theme={theme} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => {
                const variant = product.variants[0];
                const isAdding = addingId === `${product._id}-${variant._id}`;

                return (
                  <ProductCard
                    key={product._id}
                    product={product}
                    variant={variant}
                    isAdding={isAdding}
                    onAddToCart={handleAddToCart}
                    theme={theme}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              theme={theme}
            />
          </>
        )}
      </div>
    </div>
  );
}

// === Reusable Components ===
const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="rounded-2xl border bg-gray-200 dark:bg-gray-800 p-4 animate-pulse">
        <div className="bg-gray-300 dark:bg-gray-700 h-64 rounded-xl mb-3" />
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mt-2" />
      </div>
    ))}
  </div>
);

const EmptyState = ({ theme }) => (
  <div className="text-center py-20">
    <div className="inline-block p-8 rounded-3xl bg-gray-100 dark:bg-gray-800 mb-6">
      <Search size={48} className={theme.sub} />
    </div>
    <p className={`text-xl ${theme.sub}`}>No products found.</p>
    <p className={`text-sm mt-2 ${theme.sub}`}>Try adjusting your filters.</p>
  </div>
);




const Pagination = ({ page, totalPages, setPage, theme }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
        className={`px-4 py-2 rounded-xl border ${theme.border} ${theme.text} ${
          page === 1 ? 'opacity-50 cursor-not-allowed' : theme.hover
        }`}
      >
        Previous
      </button>

      <div className="flex gap-1">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`w-10 h-10 rounded-xl font-medium transition ${
              page === i + 1
                ? 'bg-purple-600 text-white'
                : `${theme.card} ${theme.border} ${theme.text} ${theme.hover}`
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className={`px-4 py-2 rounded-xl border ${theme.border} ${theme.text} ${
          page === totalPages ? 'opacity-50 cursor-not-allowed' : theme.hover
        }`}
      >
        Next
      </button>
    </div>
  );
};