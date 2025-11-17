// src/components/about/BrandStory.jsx
import React from 'react';

const BrandStory = ({ theme }) => {
  return (
    <section className={`py-20 px-6 ${theme.sectionBg}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${theme.textPrimary}`}>
              Our Journey
            </h2>
            <div className={`space-y-4 ${theme.textSecondary}`}>
              <p>
                Founded in 2020 in a tiny apartment, <strong>ShopHub</strong> began with a simple idea: 
                <span className={theme.accent}> make streetwear that speaks.</span>
              </p>
              <p>
                We saw too many brands chasing trends — we wanted to <em>start</em> them. 
                From hand-drawn sketches to global shipping, every piece is designed with real people in mind.
              </p>
              <p>
                Today, we’re proud to be worn by creators, dreamers, and doers in over 15 countries — 
                all while staying true to sustainability, quality, and community.
              </p>
            </div>
          </div>
          <div className="relative group">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Team working on designs"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;