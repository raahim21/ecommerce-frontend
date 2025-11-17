


// src/components/Navbar.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  Heart,
  LogOut,
  Loader2,
} from 'lucide-react';

import ProductSearch from '../components/ProductSearch.jsx'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import DarkModeToggle from './DarkmodeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useTheme } from '../context/ThemeContext.jsx';   // <-- NEW
import WishlistDropdown from './WishlistDropdown.jsx';
import { useWishlist } from '../hooks/useWishlist.js';


const Navbar = () => {
  const { count } = useWishlist();
  const { darkMode } = useTheme();               // <-- NEW
  const { totalItems, loading } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() =>{
        const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/products?`, {
                credentials: 'include', // sends cookies
            });

            if (!res.ok) throw new Error('Failed to load products');

            const data = await res.json();
        } catch (err) {
            console.error(err);
        }
    };

    fetchProducts()
  }, [])

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen((p) => !p);

  /* ---------- THEME CLASSES (memoised) ---------- */
  const theme = useMemo(
    () => ({
      // Navbar background (sticky)
      navBg: darkMode ? 'bg-gray-900/95' : 'bg-white/95',
      navBorder: darkMode ? 'border-gray-700' : 'border-gray-200',
      navShadow: isScrolled ? 'shadow-lg' : 'shadow-none',

      // Text colors
      textPrimary: darkMode ? 'text-white' : 'text-gray-900',
      textSecondary: darkMode ? 'text-gray-300' : 'text-gray-700',
      textMuted: darkMode ? 'text-gray-500' : 'text-gray-500',

      // Input / search bar
      searchBg: darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-50',
      searchPlaceholder: darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500',

      // Icon hover bg
      iconHoverBg: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',

      // Mobile menu
      mobileMenuBg: darkMode ? 'bg-gray-900' : 'bg-white',
      mobileMenuBorder: darkMode ? 'border-gray-700' : 'border-gray-200',
      mobileHoverBg: darkMode ? 'hover:bg-gray-800' : 'hover:bg-purple-50',
      mobileHoverText: darkMode ? 'hover:text-purple-400' : 'hover:text-purple-600',
    }),
    [darkMode, isScrolled]
  );

  return (
    <>
      {/* Promo Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 px-4 text-sm">
        <p className="hidden md:inline">
          Free shipping on orders over $50! Limited time offer.{' '}
          <a href="/deals" className="font-semibold underline hover:no-underline">
            Shop Now
          </a>
        </p>
        <p className="md:hidden">Free shipping on $50+</p>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 ${theme.navBg} backdrop-blur-md border-b ${theme.navBorder} transition-shadow duration-300 ${theme.navShadow}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-200" />
              <span
                className={`text-2xl font-bold bg-gradient-to-r ${
                  darkMode ? 'from-gray-100 to-gray-300' : 'from-gray-900 to-gray-700'
                } bg-clip-text text-transparent`}
              >
                ShopHub
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`relative group ${theme.textSecondary} hover:text-purple-600 font-medium transition-all duration-200 py-2`}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Desktop Right Icons */}
            <div className="hidden md:flex items-center space-x-4">

              {/* Search */}
              <div className="group relative">
                <div
                  className={`flex items-center ${theme.searchBg} rounded-full px-4 py-2 w-72 transition-all duration-200 group-hover:shadow-sm`}
                >
                <ProductSearch theme={theme} darkMode={darkMode} />
                </div>
              </div>

              {/* Wishlist */}
              {/* <Link
                to="/wishlist"
                className={`relative p-2 ${theme.iconHoverBg} rounded-full transition-all duration-200 group`}
              >
                <Heart
                  className={`w-6 h-6 ${theme.textSecondary} group-hover:text-red-500 transition-colors`}
                />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg">
                  3
                </span>
              </Link> */}



            <div className="relative group">
  <Link
    to="/wishlist"
    className={`relative p-2 rounded-full ${theme.cardBg} shadow-sm hover:shadow-md transition-all duration-300`}
  >
    <div className="relative">
      <Heart
        className={`${theme.textPrimary} w-6 h-6 ${theme.textSub} group-hover:text-red-500 transition-colors duration-300`}
      />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold shadow-md scale-100 group-hover:scale-110 transition-transform duration-300">
          {count}
        </span>
      )}
    </div>
  </Link>

  {/* Dropdown */}
  <div className="absolute right-0 mt-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300">
    <WishlistDropdown />
  </div>
</div>


              {/* Cart */}
              <Link
                to="/cart"
                className={`relative p-2 ${theme.iconHoverBg} rounded-full transition-all duration-200 group`}
              >
                <ShoppingCart
                  className={`w-6 h-6 ${theme.textSecondary} group-hover:text-purple-600 transition-colors`}
                />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {loading ? (
                      <Loader2 className="animate-spin w-4 h-4 text-white" />
                    ) : (
                      totalItems
                    )}
                  </span>
                )}
              </Link>

              {/* Account */}
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className={`p-2 ${theme.iconHoverBg} rounded-full transition-all duration-200 group`}
                >
                  <User
                    className={`w-6 h-6 ${theme.textSecondary} group-hover:text-purple-600 transition-colors`}
                  />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={`p-2 ${theme.iconHoverBg} rounded-full transition-all duration-200 group`}
                >
                  <User
                    className={`w-6 h-6 ${theme.textSecondary} group-hover:text-purple-600 transition-colors`}
                  />
                </Link>
              )}

              {/* Logout */}
              {user && (
                <button
                  onClick={logout}
                  className={`p-2 ${theme.iconHoverBg} rounded-full transition-all duration-200 group`}
                  title="Logout"
                >
                  <LogOut
                    className={`w-6 h-6 ${theme.textSecondary} group-hover:text-red-600 transition-colors`}
                  />
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className={`lg:hidden p-2 ${theme.iconHoverBg} rounded-lg transition-all duration-200`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className={`w-7 h-7 ${theme.textSecondary}`} />
              ) : (
                <Menu className={`w-7 h-7 ${theme.textSecondary}`} />
              )}
            </button>

            {/* Dark Mode Toggle */}
            <div className="ml-2">
              <DarkModeToggle />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4 pt-2 px-2">
            <div
              className={`flex items-center ${theme.searchBg} rounded-full px-4 py-3 transition-all duration-200`}
            >

                <ProductSearch theme={theme} darkMode={darkMode} />
            
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`lg:hidden border-t ${theme.mobileMenuBorder} ${theme.mobileMenuBg}`}
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`block py-3 px-4 rounded-xl ${theme.textSecondary} ${theme.mobileHoverBg} ${theme.mobileHoverText} font-medium transition-all duration-200 border-r-4 border-transparent hover:border-purple-600`}
                  onClick={toggleMobileMenu}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-6 border-t border-gray-600 space-y-4">
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className={`flex items-center justify-between p-4 rounded-xl ${theme.mobileHoverBg} hover:text-red-500 transition-all duration-200`}
                  onClick={toggleMobileMenu}
                >
                  <div className="flex items-center space-x-4">
                    <Heart className={`w-6 h-6 flex-shrink-0 ${theme.textSecondary}`} />
                    <span className={` ${theme.textPrimary} font-medium`}>Wishlist</span>
                  </div>
                  <span className="bg-red-500 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold">
                    3
                  </span>
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className={`flex items-center justify-between p-4 rounded-xl ${theme.mobileHoverBg} hover:text-purple-600 transition-all duration-200`}
                  onClick={toggleMobileMenu}
                >
                  <div className="flex items-center space-x-4">
                    <ShoppingCart className={`w-6 h-6 flex-shrink-0 ${theme.textSecondary}`} />
                    <span className={` ${theme.textPrimary} font-medium`}>Cart</span>
                  </div>
                  {totalItems > 0 && (
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* Account */}
                <Link
                  to="/account"
                  className={`flex items-center space-x-4 p-4 rounded-xl ${theme.mobileHoverBg} transition-all duration-200`}
                  onClick={toggleMobileMenu}
                >
                  <User className={`w-6 h-6 flex-shrink-0 ${theme.textSecondary}`} />
                  <span className={`font-medium ${theme.textPrimary}`}>Account</span>
                </Link>

                {/* Logout */}
                {user && (
                  <button
                    onClick={logout}
                    className={`flex w-full items-center space-x-4 p-4 rounded-xl ${theme.mobileHoverBg} hover:text-red-600 transition-all duration-200`}
                  >
                    <LogOut className={`w-6 h-6 flex-shrink-0 ${theme.textSecondary}`} />
                    <span className={`font-medium ${theme.textPrimary} `}>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;