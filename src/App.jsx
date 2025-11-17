// // src/App.jsx
// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import { useCart } from './hooks/useCart';
// import CartPage from './components/Cart/CartPage';
// import { Toaster } from 'react-hot-toast';
// import ProductDetail from './pages/ProductDetail';
// import AddProduct from './pages/admin/AddProduct'

// // Inside your <Routes>

// // Pages
// import Home from './pages/Home';
// // import Shop from './pages/Shop';
// // import ProductDetail from './pages/ProductDetail';
// import Confirmation from './pages/Confirmation';
// import Login from './pages/Login';
// import Register from './pages/Register';

// // Components
// import Navbar from './components/Navbar';
// import FooterSocials from './components/About/FooterSocials'
// // import Footer from './components/Footer';
// import ProtectedRoute from './components/ProtectedRoute';
// import Shop from './pages/Shop';
// import ForgotPassword from './pages/ForgetPassword';
// import ResetPassword from './pages/ResetPassword';
// import Checkout from './pages/checkout';
// import About from './pages/About';
// import AccountPage from './pages/Account';
// import OrderDetailsPage from './pages/OrderDetails';

// const App = () => {
//   return (
//     <Router>
//       <div className="min-h-screen flex flex-col">
//         <main className="flex-1">
//           <Routes>
//             {/* Public Routes */}
            
//               <Route path="/product/:id" element={<ProductDetail />} />

//               <Route
//               path="/shop"
//               element={
//                 // <ProtectedRoute>
//                   <Shop/>
//                 // </ProtectedRoute>
//               }
//               />

//               <Route
//               path="/about"
//               element={
                
//                   <About/>
                
//               }
//               />

//               <Route  
//               path='/checkout'
//               element={
//                 <Checkout/>
//               }
//               />
//               <Route
//               index
//               path="/"
//               element={
//                 // <ProtectedRoute>
//                   <Home/>
//                 // </ProtectedRoute>
//               }
//               />

//             <Route 
//             path="/account" 
//             element={
//               <ProtectedRoute>
//               <AccountPage />
//               </ProtectedRoute>
//             }
//               />



//               <Route              
//               path="/forgot-password"
//               element={
//                 // <ProtectedRoute>
//                   <ForgotPassword/>
//                 // </ProtectedRoute>
//               }
//               />
//               <Route

//               path="/reset-password/:token"
//               element={
//                   <ResetPassword/>
//               }
//               />



//             <Route path="/cart" element={<CartPage />} />
            
//             {/* <Route path="/shop" element={<Shop />} /> */}
//             {/* <Route path="/product/:id" element={<ProductDetail />} /> */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/order/:id" element={<OrderDetailsPage />} />
//             <Route path="/register" element={<Register />} />
//             <Route path='/verify' element={<Confirmation/>} />


//             {/* Admin Routes */}
//             <Route
//               path="/admin/add-product"
//               element={
//                 <ProtectedRoute>
//                   <AddProduct/>
//                 </ProtectedRoute>
//               }
//             />

//             {/* 404 */}
//             {/* <Route path="*" element={<NotFound />} /> */}
//           </Routes>
//         </main>
//         {/* <Footer /> */}

//         <Toaster
//           position="bottom-right"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: '#363636',
//               color: '#fff',
//             },
//           }}
//         />
        
//       </div>
//       <FooterSocials/>
//     </Router>
//   );
// };

// export default App;


















// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; // ← Added
import { useThemeClasses } from './hooks/useThemeClasses'; // ← Added
import Dashboard from './pages/admin/Dashboard';
import ProductsList from './pages/admin/ProductsList';
import { Toaster } from 'react-hot-toast';

import { useAuth } from './context/AuthContext';
import { useCart } from './hooks/useCart';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Confirmation from './pages/Confirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import Checkout from './pages/checkout';
import About from './pages/About';
import AccountPage from './pages/Account';
import OrderDetailsPage from './pages/OrderDetails';
import AddProduct from './pages/admin/AddProduct';
import CartPage from './components/Cart/CartPage';

// Components
import FooterSocials from './components/About/FooterSocials';
import ProtectedRoute from './components/ProtectedRoute';
// import CartPage from './components/Cart/CartPage'; // (you had it imported twice, cleaned up)

// Optional: If you want a dedicated NotFound page later
// import NotFound from './pages/NotFound';

const AppContent = () => {
  const theme = useThemeClasses();

  return (
    <div className={`min-h-screen flex flex-col ${theme.pageBg} transition-colors duration-300`}>
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify" element={<Confirmation />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />

          {/* Protected Routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />


                  <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requireAdmin>
              <ProductsList />
            </ProtectedRoute>
          }
        />

          {/* Admin Routes */}
          <Route
            path="/admin/add-product"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />

          {/* 404 - Optional */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>

      <FooterSocials />

      {/* Smart Toaster that respects dark mode */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme.darkMode ? '#1f2937' : '#ffffff',
            color: theme.darkMode ? '#f3f4f6' : '#1f2937',
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;