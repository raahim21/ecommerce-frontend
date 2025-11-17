// src/components/about/FinalCTA.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Instagram } from 'lucide-react';

const FinalCTA = ({ theme }) => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${theme.textPrimary}`}>
          Ready to Join the Movement?
        </h2>
        <p className={`text-xl mb-10 ${theme.textSecondary}`}>
          Explore our latest drops and find your next favorite piece.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className={`inline-flex items-center justify-center gap-3 px-10 py-4 ${theme.buttonBg} text-white font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg`}
          >
            <Package className="w-5 h-5" />
            Explore Collection
          </Link>
          <a
            href="https://instagram.com"
            className={`inline-flex items-center justify-center gap-3 px-10 py-4 ${theme.sectionBg} border ${theme.border} ${theme.textPrimary} font-bold rounded-full hover:shadow-lg transition-all duration-300`}
          >
            <Instagram className="w-5 h-5" />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;