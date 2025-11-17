// src/components/Cart/CartItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useSelector } from 'react-redux';
import { Plus, Minus, X, Loader2 } from 'lucide-react';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import toast from 'react-hot-toast';

const CartItem = ({ item, product }) => {
  const theme = useThemeClasses();
  const { update, remove, swap } = useCart();
  const itemLoading = useSelector(s => s.cart.itemLoading);
  const isSwapping = !!itemLoading[item.variantId];

  const [optimisticSize, setOptimisticSize] = React.useState(item.size);
  const [optimisticPrice, setOptimisticPrice] = React.useState(item.price);

  React.useEffect(() => {
    setOptimisticSize(item.size);
    setOptimisticPrice(item.price);
  }, [item.size, item.price]);

  const changeSize = async (newVariant) => {
    if (newVariant.size === optimisticSize || newVariant.stock <= 0 || isSwapping) return;

    setOptimisticSize(newVariant.size);
    setOptimisticPrice(newVariant.price);

    try {
      await swap(item.variantId, newVariant);
    } catch {
      setOptimisticSize(item.size);
      setOptimisticPrice(item.price);
      toast.error('Failed to change size');
    }
  };

  return (
    <div className={`rounded-2xl border ${theme.cardBg} ${theme.border} p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-opacity ${isSwapping ? 'opacity-70 pointer-events-none' : ''}`}>
      {/* Image */}
      <Link to={`/product/${item.productId}`} className="flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-sm" />
      </Link>

      {/* Info + Quantity */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <Link to={`/product/${item.productId}`} className={`block font-semibold text-base sm:text-lg ${theme.textMain} hover:underline line-clamp-2`}>
            {item.name}
          </Link>
          <p className={`text-sm ${theme.textSub} mt-1`}>
            {item.subCategory} • Size: <span className="font-medium">{optimisticSize}</span>
          </p>

          {product?.variants?.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.variants.map(v => {
                const isCurrent = v.size === optimisticSize;
                const outOfStock = v.stock === 0;
                const loading = isSwapping && v.size !== item.size;

                return (
                  <button
                    key={v._id}
                    onClick={() => changeSize(v)}
                    disabled={isCurrent || outOfStock || isSwapping}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all
                      ${isCurrent ? 'bg-purple-600 text-white' : `${theme.qtyBtnBg} hover:scale-105`}
                      ${outOfStock ? 'opacity-50' : ''} disabled:cursor-not-allowed`}
                  >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : (
                      <>{v.size}{outOfStock && ' (Out)'}</>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <p className={`mt-3 text-lg sm:text-xl font-bold ${theme.accent}`}>
            ${(optimisticPrice * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* Quantity */}
        <div className={`flex items-center gap-2 ${theme.textMain} `}>
          <button
            onClick={() => update({ variantId: item.variantId, quantity: item.quantity - 1 })}
            disabled={isSwapping}
            className={`p-2.5 rounded-xl ${theme.qtyBtnBg} touch-manipulation`}
          >
            {item.quantity <= 1 ? <X size={16} /> : <Minus size={16} />}
          </button>
          <span className={`w-12 text-center font-bold text-base sm:text-lg ${theme.textMain}`}>
            {item.quantity}
          </span>
          <button
            onClick={() => update({ variantId: item.variantId, quantity: item.quantity + 1 })}
            disabled={isSwapping}
            className={`p-2.5 rounded-xl ${theme.qtyBtnBg} touch-manipulation ${theme.textMain}`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => remove(item.variantId)}
        disabled={isSwapping}
        className={`p-2.5 rounded-xl ${theme.removeBtnHover} ${theme.removeBtnText} ${theme.textMain} touch-manipulation self-start sm:self-center`}
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default CartItem;