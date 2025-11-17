// src/components/account/AccountHeader.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const AccountHeader = () => {
  const { user } = useAuth();
  const theme = useThemeClasses();

  return (
    <section className="max-w-6xl mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {user?.name.charAt(0).toUpperCase()}
        </div>
      </div>
      <h1 className={`text-4xl md:text-5xl font-bold ${theme.textMain}`}>My Account</h1>
      <p className={`mt-3 text-lg ${theme.textSub}`}>Manage your profile, orders, and preferences</p>
    </section>
  );
};

export default AccountHeader;