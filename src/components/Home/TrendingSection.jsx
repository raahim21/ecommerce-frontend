
// src/components/Home/TrendingSection.jsx
import { useEffect, useState } from 'react';
import ProductGrid from './ProductGrid';
import { AlertCircle, ShoppingCart } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TrendingSection = ({ theme }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products?page=1&limit=8`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ProductGrid.Skeleton theme={theme} />;
  if (error) return <ProductGrid.Error message={error} theme={theme} />;
  if (!products.length) return <ProductGrid.Empty theme={theme} />;

  return <ProductGrid products={products} theme={theme} />;
};

export default TrendingSection;