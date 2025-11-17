// src/components/Cart/OrderSummary.jsx
import { Link, useNavigate } from 'react-router-dom';

const OrderSummary = ({ totalItems, totalPrice, theme }) => {
  const navigate = useNavigate();

  return (
    <div className={`rounded-2xl p-6 border ${theme.cardBg} ${theme.border} h-fit sticky top-24 shadow-xl`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme.textMain}`}>Order Summary</h2>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between"><span className={theme.textSub}>Subtotal ({totalItems} items)</span><span className={theme.textMain}>${totalPrice}</span></div>
        <div className="flex justify-between"><span className={theme.textSub}>Shipping</span><span className="text-green-600">FREE</span></div>
      </div>
      <div className={`border-t ${theme.border} pt-5 mb-6`}>
        <div className="flex justify-between items-baseline">
          <span className={`text-xl font-bold ${theme.textMain}`}>Total</span>
          <span className={`text-3xl font-bold ${theme.accent}`}>${totalPrice}</span>
        </div>
      </div>
      <button onClick={() => navigate('/checkout')} className={`w-full py-4 rounded-2xl font-bold text-white ${theme.buttonBg} shadow-lg hover:scale-105 transition-all`}>
        Proceed to Checkout
      </button>
      <Link to="/shop" className={`block text-center mt-3 py-3.5 rounded-xl font-medium border ${theme.border} ${theme.textMain} ${theme.hoverBg} transition-all`}>
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSummary;