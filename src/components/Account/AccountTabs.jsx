// src/components/account/AccountTabs.jsx
import React from 'react';
import { User, Package, ShoppingCart, Shield } from 'lucide-react';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'cart', label: 'Cart', icon: ShoppingCart },
  { id: 'settings', label: 'Settings', icon: Shield },
];

const AccountTabs = ({ activeTab, setActiveTab }) => {
  const theme = useThemeClasses();

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-300 dark:border-gray-700 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all rounded-t-lg ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : `${theme.cardBg} ${theme.textMain} ${theme.hoverBg}`
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountTabs;