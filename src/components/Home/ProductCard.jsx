// src/components/Home/ProductCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SizeSelectorModal from '../SizeSelectorModal';
import { useCart } from '../../hooks/useCart';
// import useAddToCart from '../../hooks/useAddToCart';


const ProductCard = ({ product, theme }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { add, adding } = useCart();

  return (
    <>
      <div className={`rounded-2xl border ${theme.card} ${theme.border} p-4 transition-all hover:shadow-lg ${theme.hover}`}>
        <Link to={`/product/${product._id}`}>
          <div className="aspect-square mb-4 rounded-xl overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <h3 className={`font-semibold text-lg ${theme.text} line-clamp-2`}>{product.name}</h3>
          <p className={`text-sm ${theme.sub} mb-2`}>{product.subCategory}</p>
          <p className={`text-xl font-bold ${theme.accent}`}>${product.variants[0].price}</p>
        </Link>

        <button
          onClick={() => setModalOpen(true)}
          disabled={adding}
          className={`
            w-full mt-4 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2
            ${adding ? 'bg-gray-400' : theme.button}
          `}
        >
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>

      <SizeSelectorModal
        product={product}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={add(product)}
        adding={adding}
      />
    </>
  );
};

export default ProductCard;