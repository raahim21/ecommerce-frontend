// src/components/FooterSocials.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const FooterSocials = () => {
  const { darkMode } = useTheme();

  // Theme-aware classes
  const bg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const accent = 'text-purple-600';

  return (
    <footer className={`py-8 px-6 border-t ${border} ${bg}`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className={textMuted}>© 2025 ShopHub. Made with love.</p>
        <div className="flex gap-6">
          <a href="#" className={`${textMuted} hover:${accent} transition-colors`}>
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className={`${textMuted} hover:${accent} transition-colors`}>
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className={`${textMuted} hover:${accent} transition-colors`}>
            <Facebook className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSocials;