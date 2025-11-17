import React from 'react';

// src/pages/ProductDetail.jsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Loader2, AlertCircle, Star, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import { CATEGORIES } from '../data/categories';
import { useCart } from '../hooks/useCart'; // ← uses `add`, not `addToCart`

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const { add, adding } = useCart(); // ← FIXED: `add`, not `addToCart`

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setSelectedImage(data.image);
        const inStock = data.variants.find(v => v.stock > 0);
        setSelectedVariant(inStock || data.variants[0]);
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const breadcrumb = useMemo(() => {
    if (!product) return [];
    const cat = CATEGORIES.find(c => c.name === product.category);
    return [
      { name: 'Home', to: '/' },
      { name: product.category, to: `/shop?category=${product.category}` },
      ...(cat?.sub.includes(product.subCategory) ? [{ name: product.subCategory, to: `/shop?category=${product.category}&subCategory=${product.subCategory}` }] : []),
      { name: product.name, to: null },
    ];
  }, [product]);

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
  };

  if (loading) return <div className={`${theme.bg} min-h-screen flex items-center justify-center`}><Loader2 className="animate-spin text-purple-600" size={48} /></div>;
  if (error || !product) return <div className={`${theme.bg} min-h-screen flex items-center justify-center`}><div className={`p-8 rounded-2xl ${theme.card} ${theme.border}`}><AlertCircle size={48} className="mx-auto mb-4 text-red-500" /><p className={theme.text}>{error}</p></div></div>;

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm mb-6">
          {breadcrumb.map((c, i) => (
            <React.Fragment key={i}>
              {c.to ? <Link to={c.to} className={`${theme.sub} hover:${theme.accent}`}>{c.name}</Link> : <span className={theme.text}>{c.name}</span>}
              {i < breadcrumb.length - 1 && <ChevronRight size={14} className={theme.sub} />}
            </React.Fragment>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
              <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[product.image, ...(product.images || [])].map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(img)} className={`aspect-square rounded-xl overflow-hidden border-2 ${selectedImage === img ? 'border-purple-600' : 'border-gray-300 dark:border-gray-700'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${theme.text}`}>{product.name}</h1>
              <p className={`text-lg mt-2 ${theme.sub}`}>{product.subCategory}</p>
            </div>
            <div className={`text-3xl font-bold ${theme.accent}`}>${selectedVariant?.price?.toFixed(2)}</div>
            <p className={`leading-relaxed ${theme.sub}`}>{product.description}</p>

            <div>
              <h3 className={`text-lg font-semibold mb-3 ${theme.text}`}>Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => {
                  const inStock = v.stock > 0;
                  const selected = selectedVariant?._id === v._id;
                  return (
                    <button
                      key={v._id}
                      onClick={() => inStock && setSelectedVariant(v)}
                      disabled={!inStock}
                      className={`
                        px-4 py-2 rounded-xl font-medium text-sm transition-all
                        ${selected ? 'bg-purple-600 text-white' : inStock ? `${theme.card} border ${theme.border} ${theme.text}` : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}
                        ${!inStock && 'opacity-60'}
                      `}
                    >
                      {v.size} {!inStock && '(Out)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FIXED: Use `add(product, variant)` */}
            <button
              onClick={() => add({
                productId: product._id,
                variantId: selectedVariant._id,
                name: product.name,
                image: product.image,
                subCategory: product.subCategory,
                size: selectedVariant.size,
                price: selectedVariant.price,
                quantity: 1,
              })}
              
              disabled={adding || !selectedVariant || selectedVariant.stock <= 0}
              className={`
                w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3
                ${adding || !selectedVariant || selectedVariant.stock <= 0 ? 'bg-gray-400' : theme.button + ' hover:scale-105'}
              `}
            >
              {adding ? <><Loader2 className="animate-spin" /> Adding...</> : <><ShoppingCart /> Add to Cart ({selectedVariant?.size})</>}
            </button>

            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} className={i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />)}
              <span className={`text-sm ${theme.sub}`}>(24 reviews)</span>
            </div>
          </div>
        </div>

        <Link to="/shop" className={`inline-flex items-center gap-2 mt-12 ${theme.sub} hover:${theme.accent}`}>
          <ChevronLeft /> Back to Shop
        </Link>
      </div>
    </div>
  );
}














// // src/pages/ProductDetail.jsx
// import { useEffect, useState, useMemo } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { ChevronLeft, ShoppingCart, Loader2, AlertCircle, Star, ChevronRight } from 'lucide-react';
// import { useTheme } from '../context/ThemeContext';
// import Navbar from '../components/Navbar';
// import { CATEGORIES } from '../data/categories';
// import { useCart } from '../hooks/useCart';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function ProductDetail() {
//   const { id } = useParams();
//   const { darkMode } = useTheme();
//   const { add, adding } = useCart(); // ← CORRECT

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [selectedImage, setSelectedImage] = useState('');

//   useEffect(() => {
//     fetch(`${API_BASE_URL}/api/products/${id}`)
//       .then(r => r.json())
//       .then(data => {
//         setProduct(data);
//         setSelectedImage(data.image);
//         const inStock = data.variants.find(v => v.stock > 0);
//         setSelectedVariant(inStock || data.variants[0]);
//       })
//       .catch(() => setError('Product not found'))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const breadcrumb = useMemo(() => {
//     if (!product) return [];
//     const cat = CATEGORIES.find(c => c.name === product.category);
//     return [
//       { name: 'Home', to: '/' },
//       { name: product.category, to: `/shop?category=${product.category}` },
//       ...(cat?.sub.includes(product.subCategory) ? [{ name: product.subCategory, to: `/shop?category=${product.category}&subCategory=${product.subCategory}` }] : []),
//       { name: product.name, to: null },
//     ];
//   }, [product]);

//   const theme = { /* your theme */ };

//   if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" size={48} /></div>;
//   if (error || !product) return <div className="min-h-screen flex items-center justify-center"><p>{error}</p></div>;

//   return (
//     <div className={`min-h-screen ${theme.bg}`}>
//       <Navbar />
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         {/* ... rest of UI ... */}

//         <button
//           onClick={() => add({
//             productId: product._id,
//             variantId: selectedVariant._id,
//             name: product.name,
//             image: product.image,
//             subCategory: product.subCategory,
//             size: selectedVariant.size,
//             price: selectedVariant.price,
//             quantity: 1,
//           })}
//           disabled={adding || !selectedVariant || selectedVariant.stock <= 0}
//           className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 ${adding || !selectedVariant || selectedVariant.stock <= 0 ? 'bg-gray-400' : theme.button}`}
//         >
//           {adding ? <><Loader2 className="animate-spin" /> Adding...</> : <><ShoppingCart /> Add to Cart ({selectedVariant?.size})</>}
//         </button>

//         {/* ... */}
//       </div>
//     </div>
//   );
// }