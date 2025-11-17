// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const AdminLayout = ({ children }) => {
  const theme = useThemeClasses();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/orders' },
  ];

  return (
    <>
      {/* <Navbar /> */}

      <div className={`min-h-screen ${theme.pageBg} flex`}>
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar — Sticky on Desktop, Slide-in on Mobile */}
        <aside
          className={`
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            fixed lg:sticky lg:top-0 lg:h-screen
            z-50 w-72 ${theme.cardBg} border-r ${theme.border}
            flex flex-col transition-transform duration-300 ease-in-out
            overflow-y-auto
          `}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className={`text-sm ${theme.textSub} mt-1`}>Hello, {user?.name || 'Admin'}</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 hover:text-black rounded-lg text-lg font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : `${theme.textMain} ${theme.hoverBg} hover:bg-purple-50 dark:hover:bg-gray-700`
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout — Pinned to Bottom */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={logout}
              className="w-full py-3 px-4 text-red-600 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-300 dark:border-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page Content */}
          <main className="flex-1 p-6 pt-24 lg:pt-8 lg:p-10 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;