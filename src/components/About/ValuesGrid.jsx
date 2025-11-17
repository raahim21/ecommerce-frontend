// src/components/about/ValuesGrid.jsx
import React from 'react';
import { Heart, Leaf, User, Star } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Quality First', desc: 'Premium fabrics, expert craftsmanship, built to last.' },
  { icon: Leaf, title: 'Sustainable', desc: 'Eco-friendly materials & ethical production.' },
  { icon: User, title: 'One Man Army', desc: 'This website was built by raahim wajid' },
  { icon: Star, title: 'Innovation', desc: 'Always pushing trends, never following.' },
];

const ValuesGrid = ({ theme }) => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-4xl md:text-5xl font-bold text-center mb-16 ${theme.textPrimary}`}>
          What We Stand For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, i) => (
            <div
              key={i}
              className={`group p-8 rounded-2xl ${theme.sectionBg} border ${theme.border} ${theme.hoverBg} transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}
            >
              <div className={`w-14 h-14 ${theme.iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <value.icon className={`w-7 h-7 ${theme.accent}`} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${theme.textPrimary}`}>{value.title}</h3>
              <p className={theme.textSecondary}>{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesGrid;