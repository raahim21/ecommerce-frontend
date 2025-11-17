// src/hooks/useThemeClasses.js
import { useTheme } from '../context/ThemeContext';

export const useThemeClasses = () => {
  const { darkMode } = useTheme();

  return {
    pageBg: darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50',
    cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
    textMain: darkMode ? 'text-white' : 'text-gray-900',
    textSub: darkMode ? 'text-gray-400' : 'text-gray-600',
    textMuted: darkMode ? 'text-gray-500' : 'text-gray-400',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hoverBg: darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-50',
    accent: 'text-purple-600',
    buttonBg: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
    success: 'text-green-500',
    danger: 'text-red-500',
  };
};