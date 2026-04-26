'use client';

import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  'SYSTRA', 'Logis', 'Optis', 'SupplyLink', 'NexTrade', 'FlowScale', 'RouteWise'
];

export default function PartnerLogos() {
  return (
    <section className="py-12 bg-white">
      <div className="container relative py-12 px-6 border-x border-slate-100">
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:opacity-100 transition-opacity duration-500">
          {logos.map((logo, index) => (
            <span key={index} className="text-xl font-bold tracking-tighter text-slate-900">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
