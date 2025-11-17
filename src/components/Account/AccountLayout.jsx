
// src/components/account/AccountLayout.jsx
import React from 'react';
import Navbar from '../Navbar';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const AccountLayout = ({ children }) => {
  const theme = useThemeClasses();

  return (
    <div className={`min-h-screen ${theme.pageBg}`}>
      <Navbar />
      <main className="py-16 px-6">{children}</main>
      <div className="h-20" />
    </div>
  );
};

export default AccountLayout;