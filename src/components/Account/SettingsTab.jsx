// src/components/account/SettingsTab.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Key, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const SettingsTab = () => {
  const { logout } = useAuth();
  const theme = useThemeClasses();

  return (
    <div className="space-y-6">
      <Link
        to="/change-password"
        className={`flex items-center justify-between p-4 rounded-lg border ${theme.border} ${theme.hoverBg}`}
      >
        <div className="flex items-center gap-3">
          <Key className={`w-5 h-5 ${theme.accent}`} />
          <span className={theme.textMain}>Change Password</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </Link>

      <button
        onClick={logout}
        className={`w-full flex items-center justify-between p-4 rounded-lg border ${theme.border} ${theme.hoverBg} text-red-500`}
      >
        <div className="flex items-center gap-3">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </div>
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="pt-6 border-t border-gray-300 dark:border-gray-700">
        <p className="text-sm text-red-500">Delete Account (Irreversible)</p>
        <button className="mt-2 text-xs underline">Request Account Deletion</button>
      </div>
    </div>
  );
};

export default SettingsTab;