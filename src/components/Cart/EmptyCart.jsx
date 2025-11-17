
// // // src/components/Cart/EmptyCart.jsx
// // import { ShoppingCart } from 'lucide-react';
// // import { Link } from 'react-router-dom';
// // import Navbar from '../Navbar';

// // const EmptyCart = ({ theme }) => (
// //   <div className={`min-h-screen ${theme.pageBg}`}>
// //     <Navbar />
// //     <div className="max-w-7xl mx-auto px-4 py-16 text-center">
// //       <div className={`inline-flex items-center justify-center w-32 h-32 rounded-3xl ${theme.cardBg} mb-8 shadow-xl`}>
// //         <ShoppingCart size={64} className={theme.textSub} />
// //       </div>
// //       <h1 className={`text-5xl font-bold mb-4 ${theme.textMain}`}>Your cart is empty</h1>
// //       <p className={`text-lg mb-10 ${theme.textSub}`}>Looks like you haven't added anything yet.</p>
// //       <Link
// //         to="/shop"
// //         className={`inline-block px-12 py-4 rounded-2xl font-bold text-white text-lg ${theme.buttonBg} transition-all hover:scale-105 shadow-xl`}
// //       >
// //         Explore Products
// //       </Link>
// //     </div>
// //   </div>
// // );

// // export default EmptyCart;









// // EmptyCart.jsx
// import { ShoppingCart } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import Navbar from '../Navbar';

// const EmptyCart = ({ theme }) => (
//   <div className={`min-h-screen ${theme.pageBg}`}>
//     <Navbar />
//     <div className="max-w-7xl mx-auto px-4 py-16 text-center">
//       <div className={`inline-flex items-center justify-center w-32 h-32 rounded-3xl ${theme.cardBg} mb-8 shadow-xl`}>
//         <ShoppingCart size={64} className={theme.textSub} />
//       </div>
//       <h1 className={`text-5xl font-bold mb-4 ${theme.textMain}`}>Your cart is empty</h1>
//       <Link to="/shop" className={`inline-block px-12 py-4 rounded-2xl font-bold text-white text-lg ${theme.buttonBg} transition-all hover:scale-105 shadow-xl`}>
//         Explore Products
//       </Link>
//     </div>
//   </div>
// );

// export default EmptyCart;



import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const EmptyCart = () => {
  const theme = useThemeClasses();

  return (
    <div className={`min-h-screen ${theme.pageBg}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-3xl ${theme.cardBg} mb-8 shadow-xl`}>
          <ShoppingCart size={64} className={theme.textSub} />
        </div>
        <h1 className={`text-5xl font-bold mb-4 ${theme.textMain}`}>Your cart is empty</h1>
        <Link
          to="/shop"
          className={`inline-block px-12 py-4 rounded-2xl font-bold text-white text-lg ${theme.buttonBg} transition-all hover:scale-105 shadow-xl`}
        >
          Explore Products
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;