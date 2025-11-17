
// src/components/Cart/CartPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../hooks/useCart';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import EmptyCart from './EmptyCart';
import CartSkeleton from './CartSkeleton';
import Navbar from '../Navbar';

const API = import.meta.env.VITE_API_BASE_URL;

const CartPage = () => {
  const { darkMode } = useTheme();
  const {
    items,
    totalItems,
    totalPrice,
    loading,
    itemLoading,
    update,
    remove,
  } = useCart();

  const [products, setProducts] = useState({});
  const [hasCheckedEmpty, setHasCheckedEmpty] = useState(false);

  /* ---------- STABLE IDS ---------- */
  const productIds = useMemo(() => {
    return [...new Set(items.map(i => i.productId))];
    
  }, [items]);

  const productIdsString = productIds.join(',');

  /* ---------- FETCH PRODUCT DETAILS ---------- */
  useEffect(() => {
    if (!productIdsString) {
      setProducts({});
      return;
    }

    fetch(`${API}/api/products/byIds?ids=${productIdsString}`, {
      credentials: 'include',
    })
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(d => {
        const map = {};
        d.products.forEach(p => { map[p._id] = p; });
        setProducts(map);
      })
      .catch(() => {});
  }, [productIdsString]);

  /* ---------- LOADING → EMPTY CHECK ---------- */
  useEffect(() => {
    if (!loading) setHasCheckedEmpty(true);
  }, [loading]);

  /* ---------- THEME ---------- */
  const theme = useMemo(() => ({
    pageBg: darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50',
    cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
    textMain: darkMode ? 'text-white' : 'text-gray-900',
    textSub: darkMode ? 'text-gray-400' : 'text-gray-600',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hoverBg: darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-50',
    buttonBg: darkMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
    accent: darkMode ? 'text-purple-400' : 'text-purple-600',
    qtyBtnBg: darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200',
    removeBtnHover: darkMode ? 'hover:bg-red-900/40' : 'hover:bg-red-50',
    removeBtnText: darkMode ? 'text-red-400' : 'text-red-600',
  }), [darkMode]);

  /* ---------- RENDER ---------- */
  if (loading || !hasCheckedEmpty) return <CartSkeleton theme={theme} />;
  if (totalItems === 0) return <EmptyCart theme={theme} />;

  return (
    <div className={`min-h-screen ${theme.pageBg}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-4xl md:text-5xl font-bold mb-10 text-center ${theme.textMain}`}>
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => (
              <CartItem
                key={item.variantId}
                item={item}
                product={products[item.productId]}
                isLoading={itemLoading[item.variantId]}
                isSwapping={itemLoading[item.variantId]}
                theme={theme}
                onUpdate={update}
                onRemove={remove}
              />
            ))}
          </div>
          <OrderSummary totalItems={totalItems} totalPrice={totalPrice} theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;