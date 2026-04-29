'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Network, Database, Cpu } from 'lucide-react';

const results = [
  {
    title: 'Intelligent Forecasting',
    desc: 'Align your inventory with actual demand patterns.',
    icon: Database
  },
  {
    title: 'Dynamic Routing',
    desc: 'Bypass bottlenecks with real-time path optimization.',
    icon: Network
  },
  {
    title: 'Automated Compliance',
    desc: 'Ensure every shipment meets regulatory standards automatically.',
    icon: Cpu
  }
];

export default function Results() {
  return (
    <section className="p-0">
      <div className="container p-0 border-x border-slate-100">
        <div className="text-center py-24 border-b border-slate-100 px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">AI that delivers <br /> supply chain results</h2>
          <p className="text-slate-500 max-w-[600px] mx-auto text-lg mb-10">
            Our technology is built to solve the hardest problems in logistics.
          </p>
          <button className="btn-primary">Try now for free</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {results.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={`p-16 flex flex-col items-center text-center border-b border-slate-100 ${i < 2 ? 'md:border-r' : ''}`}
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-primary mb-8 border border-slate-100 shadow-sm">
                <item.icon size={36} />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{item.title}</h3>
              <p className="text-slate-500 text-lg leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
