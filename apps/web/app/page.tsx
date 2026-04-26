import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import AIFeatures from '../components/sections/AIFeatures';
import Portfolio from '../components/sections/Portfolio';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <AIFeatures />
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
}

