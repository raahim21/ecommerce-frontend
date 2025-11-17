// src/components/WishlistDropdown.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useThemeClasses } from '../hooks/useThemeClasses';
import clsx from 'clsx';

const WishlistDropdown = () => {
  const { items, remove, count } = useWishlist();
  const theme = useThemeClasses();

  if (count === 0) return null;

  return (
    <div
      className={clsx(
        'absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl overflow-hidden',
        'border',
        theme.border,
        theme.cardBg,
        'z-50'
      )}
    >
      <div className={clsx('p-4 border-b', theme.border)}>
        <div className="flex items-center justify-between">
          <h3 className={clsx('font-semibold', theme.textMain)}>Wishlist ({count})</h3>
          <Link
            to="/wishlist"
            className={clsx('text-sm underline', theme.accent)}
          >
            View all
          </Link>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {items.map(item => (
          <div
            key={item.variantId}
            className={clsx(
              'flex items-center gap-3 p-3 border-b last:border-b-0',
              theme.border,
              theme.hoverBg
            )}
          >
            <Link to={`/product/${item.productId}`} className="flex-shrink-0">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <Link
                to={`/product/${item.productId}`}
                className={clsx('block text-sm font-medium truncate', theme.textMain)}
              >
                {item.product.name}
              </Link>
              <p className={clsx('text-xs', theme.textSub)}>
                Size: {item.variant.size} • ${item.variant.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => remove(item.variantId)}
                className={clsx('p-1.5 rounded text-red-500', theme.removeBtnHover)}
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistDropdown;