// src/components/account/CartTab.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ChevronRight } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import CartItem from '../Cart/CartItem';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const API = import.meta.env.VITE_API_BASE_URL;

const CartTab = () => {
  const theme = useThemeClasses();
  const { items } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!items.length) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const productIds = [...new Set(items.map(i => i.productId))];
      const res = await fetch(`${API}/api/products/byIds?ids=${productIds.join(',')}`, {
        credentials: 'include',
      });

      if (res.ok) {
        const { products } = await res.json();
        const map = {};
        products.forEach(p => (map[p._id] = p));

        const enriched = items.map(item => {
          const product = map[item.productId];
          const variant = product?.variants.find(v => v._id === item.variantId);
          return { ...item, product, variant };
        });
        setCartItems(enriched);
      }
      setLoading(false);
    };

    fetchCart();
  }, [items]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <p className={`text-center py-12 ${theme.textSub}`}>
        Your cart is empty. <Link to="/shop" className={theme.accent}>Shop now!</Link>
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {cartItems.map(item => (
        <CartItem key={item.variantId} item={item} product={item.product} />
      ))}
      <Link
        to="/cart"
        className={`w-full mt-6 flex justify-center items-center gap-2 py-3 ${theme.buttonBg} text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all`}
      >
        Go to Checkout <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  );
};

export default CartTab;