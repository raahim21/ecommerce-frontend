



// src/pages/About.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

import HeroSection from '../components/About/HeroSection';
import BrandStory from '../components/About/BrandStory';
import ValuesGrid from '../components/About/ValuesGrid';
import TeamSection from '../components/About/TeamSection';
import TimelineSection from '../components/About/TimeLineSection';
import SocialProof from '../components/About/SocialProof';
import FinalCTA from '../components/About/FinalCTA';

const About = () => {
  const { darkMode } = useTheme();

  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50',
    sectionBg: darkMode ? 'bg-gray-800' : 'bg-white',
    textPrimary: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-100' : 'text-gray-600', // fixed
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-400',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    accent: 'text-purple-600',
    hoverBg: darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-50',
    buttonBg: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
    iconBg: darkMode ? 'bg-gray-700' : 'bg-gray-100',
  };

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      <Navbar />
      <HeroSection theme={theme} />
      <BrandStory theme={theme} />
      <ValuesGrid theme={theme} />
      <TeamSection theme={theme} />
      <TimelineSection theme={theme} />
      <SocialProof theme={theme} />
      <FinalCTA theme={theme} />
    </div>
  );
};

export default About;