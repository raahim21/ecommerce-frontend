


// src/pages/AccountPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


import AccountLayout from '../components/Account/AccountLayout';
import AccountHeader from '../components/Account/AccountHeader';
import AccountTabs from '../components/Account/AccountTabs';
import ProfileTab from '../components/Account/ProfileTab';
import OrdersTab from '../components/Account/OrdersTab';
import CartTab from '../components/Account/CartTab';
import SettingsTab from '../components/Account/SettingsTab';
import { Theater } from 'lucide-react';
import { useThemeClasses } from '../hooks/useThemeClasses';

const AccountPage = () => {
  let theme = useThemeClasses()
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <AccountLayout>
      <AccountHeader />
      <AccountTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className={`max-w-6xl mx-auto px-6 ${theme.cardBg} `}>
        <div className=" dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'orders' && <OrdersTab user={user} />}
          {activeTab === 'cart' && <CartTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </AccountLayout>
  );
};

export default AccountPage;