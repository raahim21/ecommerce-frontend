// src/components/about/TeamSection.jsx
import React from 'react';

const team = [
  { name: 'Sarah Chen', role: 'Founder & CEO', fact: 'Loves streetwear & coffee' },
  { name: 'Mike Torres', role: 'Head Designer', fact: 'Skateboarder since 2008' },
  { name: 'Emma Liu', role: 'Sustainability Lead', fact: 'Planted 500+ trees' },
];

const TeamSection = ({ theme }) => {
  return (
    <section className={`py-20 px-6 ${theme.sectionBg}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-4xl md:text-5xl font-bold text-center mb-16 ${theme.textPrimary}`}>
          Meet the Crew
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div
              key={i}
              className={`text-center group ${theme.hoverBg} p-6 rounded-2xl transition-all duration-300`}
            >
              <div className="w-32 h-32 mx-auto mb-5 rounded-full overflow-hidden border-4 border-purple-600/20 group-hover:border-purple-600 transition-colors">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400" />
              </div>
              <h3 className={`text-xl font-bold ${theme.textPrimary}`}>{member.name}</h3>
              <p className={`text-sm ${theme.accent} mb-2`}>{member.role}</p>
              <p className={`text-sm italic ${theme.textMuted}`}>“{member.fact}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;