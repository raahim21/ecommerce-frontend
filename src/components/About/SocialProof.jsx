// src/components/about/SocialProof.jsx
import React from 'react';

const SocialProof = ({ theme }) => {
  return (
    <section className={`py-20 px-6 ${theme.sectionBg}`}>
      <div className="max-w-6xl mx-auto text-center">
        <h2 className={`text-4xl md:text-5xl font-bold mb-12 ${theme.textPrimary}`}>
          As Seen In
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale">
          <div className={`text-3xl font-bold ${theme.textPrimary}`}>VOGUE</div>
          <div className={`text-3xl font-bold ${theme.textPrimary}`}>HYPEBEAST</div>
          <div className={`text-3xl font-bold ${theme.textPrimary}`}>GQ</div>
          <div className={`text-3xl font-bold ${theme.textPrimary}`}>COMPLEX</div>
        </div>
        <div className="mt-16">
          <blockquote className={`text-2xl italic max-w-3xl mx-auto ${theme.textSecondary}`}>
            “ShopHub is redefining streetwear with bold designs and conscious production.”
          </blockquote>
          <p className={`mt-4 ${theme.textMuted}`}>— Fashion Daily Review</p>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;