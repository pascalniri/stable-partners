import React from 'react';
import Navbar from '../components/layout/Navbar';
import PropertyHero from '../components/sections/new-design/PropertyHero';
import TurnToAsset from '../components/sections/new-design/TurnToAsset';
import WhyWorkWithUs from '../components/sections/new-design/WhyWorkWithUs';
import TrustSection from '../components/sections/new-design/TrustSection';
import RegistrationForm from '../components/sections/new-design/RegistrationForm';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main>
        <PropertyHero />
        <TurnToAsset />
        <WhyWorkWithUs />
        <TrustSection />
        <RegistrationForm />
      </main>
      <Footer />
    </div>
  );
}
