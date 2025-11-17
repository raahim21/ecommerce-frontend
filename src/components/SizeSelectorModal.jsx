



// src/components/SizeSelectorModal.jsx
import React from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SizeSelectorModal = ({ product, isOpen, onClose, onAdd, adding }) => {
  const { darkMode } = useTheme();
  const [selected, setSelected] = React.useState(null);



// Runs whenever the modal opens or the product changes.
// Finds the first variant that is in stock.
// If no variant is in stock, just picks the first variant.
// Purpose: pre-select a valid size automatically for the user.

  React.useEffect(() => {
    if (isOpen && product) {
      const inStock = product.variants.find(v => v.stock > 0);
      setSelected(inStock || product.variants[0]);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  // === THEME (No purple in dark mode) ===
  const theme = {
    overlay: 'bg-black/60 backdrop-blur-sm',
    modal: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-900',
    sub: darkMode ? 'text-gray-400' : 'text-gray-600',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    selectedBg: darkMode ? 'bg-purple-900/20 border-purple-500' : 'bg-purple-50 border-purple-600',
    buttonBg: darkMode
      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
      : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700',
    disabledButton: 'bg-gray-500',
    closeBtnHover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
  };

  return (
    <div className={`fixed inset-0 ${theme.overlay} z-50 flex items-center justify-center p-4`}>
      <div
        className={`${theme.modal} rounded-3xl p-6 max-w-sm w-full shadow-2xl border ${theme.border} transition-all`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className={`text-xl font-bold ${theme.text}`}>Select Size</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${theme.closeBtnHover}`}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Size Options */}
        <div className="space-y-3">
          {product.variants.map((v) => {
            const inStock = v.stock > 0;






            const isSelected = selected?._id === v._id;

            return (
              <button
                key={v._id}
                // checks if is in stock, and if it s, select it
                onClick={() => inStock && setSelected(v)}

                // disable any variant not in stock
                disabled={!inStock}
                className={`
                  w-full p-4 rounded-2xl border-2 font-medium text-left transition-all
                  ${isSelected ? theme.selectedBg : `border-transparent ${theme.modal}`}
                  ${!inStock ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-400'}
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                  ${darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
                `}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-lg ${theme.text}`}>{v.size}</span>
                  <span className={`text-sm ${theme.sub}`}>
                    {inStock ? `${v.stock} left` : 'Out of stock'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Add Button */}
        <button
          onClick={() => selected && onAdd(product, selected)}
          disabled={adding || !selected}
          className={`
            w-full mt-6 py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2
            transition-all duration-200 hover:scale-[1.02]
            ${adding || !selected ? theme.disabledButton : theme.buttonBg}
            disabled:opacity-70 disabled:cursor-not-allowed
          `}
        >
          {adding ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add to Cart ({selected?.size})
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SizeSelectorModal;