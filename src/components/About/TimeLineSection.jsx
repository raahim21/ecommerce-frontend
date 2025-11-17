// src/components/about/TimelineSection.jsx
import React from 'react';

const timeline = [
  { year: '2020', event: 'ShopHub Founded', desc: 'Started in a garage with 3 designs' },
  { year: '2021', event: 'First 1000 Orders', desc: 'Community exploded overnight' },
  { year: '2022', event: 'Sustainable Line Launch', desc: '100% recycled materials' },
  { year: '2024', event: '10K+ Happy Customers', desc: 'Now in 15 countries' },
];

const TimelineSection = ({ theme, darkMode }) => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className={`text-4xl md:text-5xl font-bold text-center mb-16 ${theme.textPrimary}`}>
          Our Milestones
        </h2>
        <div className="relative">
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} h-full hidden md:block`} />
          {timeline.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row items-center mb-12 md:mb-16 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full md:w-1/2 px-6 text-center md:text-left">
                <div className={`inline-block px-4 py-2 rounded-full ${theme.textPrimary} ${theme.sectionBg} border ${theme.border} text-sm font-semibold mb-3`}>
                  {item.year}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>{item.event}</h3>
                <p className={theme.textSecondary}>{item.desc}</p>
              </div>
              <div className="w-4 h-4 bg-purple-600 rounded-full absolute left-1/2 transform -translate-x-1/2 hidden md:block z-10" />
              <div className="md:w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;