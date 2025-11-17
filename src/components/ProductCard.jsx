// // src/components/ProductCard.jsx
// import React, { useState } from 'react';
// import SizeSelectorModal from './SizeSelectorModal';
// import { Link } from 'react-router-dom';
// import { Plus, ShoppingCart, Loader2 } from 'lucide-react';
// import toast from 'react-hot-toast';

// const ProductCard = ({ product, variant, isAdding, onAddToCart, theme }) => {
//   const [showSizeModal, setShowSizeModal] = useState(false);
//   const handleAdd = (product, selectedVariant) => {
//     // gets the selected variant from SizeSelector
//   onAddToCart(product, selectedVariant);
// };

// // check if the product has multiple sizes
//   const hasMultipleSizes = product.variants?.length > 1;

//   return (
//     <div className="group">
//       <Link
//         to={`/product/${product._id}`}
//         className={`
//           block rounded-3xl overflow-hidden border ${theme.card} ${theme.border}
//           transition-all duration-300 hover:shadow-xl hover:-translate-y-2
//           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
//           ${theme.darkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
//         `}
//       >
//         {/* IMAGE */}
//         <div className="relative aspect-square overflow-hidden bg-gray-100">
//           {product.image ? (
//             <img
//               src={product.image}
//               alt={product.name}
//               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//               loading="lazy"
//             />
//           ) : (
//             <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-3xl flex items-center justify-center">
//               <span className="text-gray-400 text-4xl">No image</span>
//             </div>
//           )}

//           {/* Subcategory Badge */}
//           <div className={`
//             absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold
//             backdrop-blur-md shadow-md
//             ${theme.darkMode ? 'bg-gray-800/80 text-gray-200' : 'bg-white/90 text-gray-700'}
//           `}>
//             {product.subCategory}
//           </div>

//           {/* Multiple Sizes Badge */}
//           {hasMultipleSizes && (
//             <div className="absolute top-4 left-4 bg-purple-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
//               <span className="w-1.5 h-1.5 bg-white rounded-full" />
//               {product.variants.length} sizes
//             </div>
//           )}
//         </div>

//         {/* INFO */}
//         <div className="p-5 space-y-3">
//           <h3 className={`
//             font-semibold text-base md:text-lg ${theme.text}
//             line-clamp-2 leading-tight
//             group-hover:text-purple-600 dark:group-hover:text-purple-400
//             transition-colors duration-300
//           `}>
//             {product.name}
//           </h3>

//           <div className="flex items-center justify-between">
//             {/* Price */}
//             <p className={`
//               text-xl md:text-2xl font-bold
//               ${theme.darkMode ? 'text-purple-400' : 'text-purple-600'}
//             `}>
//               ${Number(variant.price).toFixed(2)}
//             </p>

//             {/* NEW: Icon-only Add to Cart Button */}
//             <button
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 setShowSizeModal(true);
//               }}









//               // to disable the button from being clicked while loading
//               disabled={isAdding}
//               className={`
//                 cursor-pointer
//                 flex items-center justify-center gap-1.5 p-2.5 rounded-full
//                 transition-all duration-200 hover:scale-110
//                 ${theme.darkMode 
//                   ? 'bg-gray-700 text-white hover:bg-gray-600' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }
//                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
//                 ${theme.darkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
//                 disabled:opacity-50 disabled:cursor-not-allowed
//               `}
//             >
//               {isAdding ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <>
//                   <ShoppingCart className="w-4 h-4" />
//                   <Plus className="w-3.5 h-3.5" />
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </Link>

//       {/* Size Modal */}
//       <SizeSelectorModal
//         product={product}
//         isOpen={showSizeModal}
//         onClose={() => setShowSizeModal(false)}
//         onAdd={handleAdd}
//         adding={isAdding}
//       />
//     </div>
//   );
// };

// export default ProductCard;







// src/components/ProductCard.jsx
import React, { useState } from 'react';
import SizeSelectorModal from './SizeSelectorModal';
import { Link } from 'react-router-dom';
import { Plus, ShoppingCart, Loader2, Heart } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useThemeClasses } from '../hooks/useThemeClasses';

const ProductCard = ({ product, variant, isAdding, onAddToCart }) => {
  const [showSizeModal, setShowSizeModal] = useState(false);
  const { toggle, isInWishlist } = useWishlist();
  const theme = useThemeClasses();

  const inWishlist = isInWishlist(variant._id);
  const hasMultipleSizes = product.variants?.length > 1;

  const handleAdd = (p, v) => onAddToCart(p, v);

  return (
    <div className="group">
      <Link
        to={`/product/${product._id}`}
        className={`
          block rounded-3xl overflow-hidden border ${theme.cardBg} ${theme.border}
          transition-all duration-300 hover:shadow-xl hover:-translate-y-2
        `}
      >
        {/* IMAGE */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-3xl flex items-center justify-center">
              <span className="text-gray-400 text-4xl">No image</span>
            </div>
          )}

          {/* Subcategory Badge */}
          <div
            className={`
              absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold
              backdrop-blur-md shadow-md
              ${theme.pageBg.includes('dark') ? 'bg-gray-800/80 text-gray-200' : 'bg-white/90 text-gray-700'}
            `}
          >
            {product.subCategory}
          </div>

          {/* Multiple Sizes Badge */}
          {hasMultipleSizes && (
            <div className="absolute top-4 left-4 bg-purple-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              {product.variants.length} sizes
            </div>
          )}

          {/* Heart (Wishlist) */}
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              toggle(product, variant);
            }}
            className={`
              absolute top-4 left-4 p-2 rounded-full transition-all
              ${inWishlist ? 'bg-red-500 text-white' : `${theme.qtyBtnBg} text-gray-600`}
              hover:scale-110 shadow-lg
            `}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* INFO */}
        <div className="p-5 space-y-3">
          <h3
            className={`
              font-semibold text-base md:text-lg ${theme.textMain}
              line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400
              transition-colors duration-300
            `}
          >
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <p className={`text-xl md:text-2xl font-bold ${theme.accent}`}>
              ${Number(variant.price).toFixed(2)}
            </p>

            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setShowSizeModal(true);
              }}
              disabled={isAdding}
              className={`
                flex items-center justify-center gap-1.5 p-2.5 rounded-full
                transition-all duration-200 hover:scale-110
                ${theme.qtyBtnBg} ${theme.textMain}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <Plus className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </Link>

      <SizeSelectorModal
        product={product}
        isOpen={showSizeModal}
        onClose={() => setShowSizeModal(false)}
        onAdd={handleAdd}
        adding={isAdding}
      />
    </div>
  );
};

export default ProductCard;