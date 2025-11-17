
// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import ProductCard from '../components/ProductCard'
import 'swiper/css';
import 'swiper/css/pagination';
import {
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../data/categories';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const heroSlides = [
  { title: 'Summer Drop', subtitle: 'Fresh fits, bold styles', bg: 'from-orange-500 to-pink-600' },
  { title: 'Streetwear Sale', subtitle: 'Up to 40% off', bg: 'from-purple-600 to-indigo-600' },
  { title: 'New Hoodies', subtitle: 'Cozy. Bold. You.', bg: 'from-teal-600 to-cyan-600' },
];

export default function Home() {
  const [adding, setAdding] = useState(false);
  const { add } = useCart();
  const {isAuthenticated} = useAuth()
  const { darkMode } = useTheme();
  const [openCat, setOpenCat] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Theme variables
  const pageBg = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textMain = darkMode ? 'text-white' : 'text-gray-900';
  const textSub = darkMode ? 'text-gray-400' : 'text-gray-600';

  const handleAddToCart = (product, variant) => {
    add({
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      image: product.image,
      subCategory: product.subCategory,
      size: variant.size,
      price: variant.price,
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products?page=1&limit=8`, {
          credentials: 'include', // sends cookies
        });
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleCategory = (i) => setOpenCat(openCat === i ? null : i);

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          loop
          className="h-full"
        >
          {heroSlides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className={`h-full bg-gradient-to-r ${slide.bg} flex items-center justify-center text-white`}>
                <div className="text-center px-6 max-w-2xl">
                  <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                  <Link
                    to="/shop"
                    className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">


        {/* Trending Now Section */}
        <section className="py-12">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-12 ${textMain}`}>
            Trending Now
          </h2>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border ${cardBg} ${border} p-4 animate-pulse space-y-3`}
                >
                  <div className="bg-gray-300 dark:bg-gray-700 h-64 rounded-xl" />
                  <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div
              className={`flex items-center justify-center gap-3 p-5 rounded-2xl border max-w-md mx-auto ${
                darkMode
                  ? 'bg-red-900/30 border-red-800 text-red-300'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <AlertCircle size={22} />
              <span className="font-medium">{error}</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart size={64} className={`mx-auto mb-4 ${textSub}`} />
              <p className={`text-lg ${textSub}`}>No trending products available right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">          
              
              {products.map((product) => {
  const variant = product.variants[0];
  const isAdding = adding === product._id;
  return (


    // Inside ProductCard
 <ProductCard
  key={product._id}
  product={product}
  variant={variant}
  isAdding={adding}
  onAddToCart={handleAddToCart}
  theme={{
    darkMode,
    card: cardBg,
    border,
    text: textMain,
    textSub,
  }}
/>
  );
})}
                          </div>
          )}
        </section>
      </div>
    </div>
  );
}