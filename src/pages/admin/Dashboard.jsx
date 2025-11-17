// src/pages/admin/Dashboard.jsx
import React from 'react';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import AdminLayout from './AdminLayout';

const Dashboard = () => {
  const theme = useThemeClasses();

  const stats = [
    { label: 'Total Products', value: '124', gradient: 'from-purple-500 to-pink-500' },
    { label: 'Total Orders', value: '89', gradient: 'from-green-500 to-emerald-500' },
    { label: 'Pending Orders', value: '12', gradient: 'from-yellow-500 to-orange-500' },
    { label: 'Revenue Today', value: '₨48,500', gradient: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <AdminLayout>
      <h1 className={`text-4xl font-bold ${theme.textMain} mb-8`}>Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${theme.cardBg} p-8 rounded-2xl shadow-xl border ${theme.border} transform hover:scale-105 transition-all duration-300`}
          >
            <div className={`h-3 rounded-t-xl bg-gradient-to-r ${stat.gradient} opacity-80`} />
            <p className={`mt-6 text-lg ${theme.textSub}`}>{stat.label}</p>
            <p className={`text-4xl font-bold mt-3 ${theme.textMain}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className={`mt-12 ${theme.cardBg} p-10 rounded-2xl shadow-xl border ${theme.border}`}>
        <h2 className={`text-2xl font-bold ${theme.textMain} mb-6`}>Recent Activity</h2>
        <p className={`${theme.textSub} text-center py-12 text-lg`}>
          Portfolio project, dashboard is for better design
        </p>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;