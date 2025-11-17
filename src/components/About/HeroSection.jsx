// src/components/about/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const HeroSection = ({ theme }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-pink-600/80 to-orange-500/90" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'ur[](https://images.unsplash.com/photo-1551489186-cf8726f514f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          Your Style, Our Passion
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          We bring bold, affordable streetwear from vision to your doorstep — sustainably and with love.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Shop Now
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;