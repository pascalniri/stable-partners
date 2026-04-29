'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function QuoteSection() {
  return (
    <section className="py-32">
      <div className="container relative">
        {/* Vertical lines that match the main grid */}
        <div className="absolute left-0 top-0 bottom-0 border-x border-slate-100/50 w-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[900px] mx-auto text-center"
        >
          <div className="inline-block mb-12">
             <span className="text-8xl text-slate-200 font-serif leading-none">"</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-medium text-slate-900 leading-[1.2] mb-12">
            Luminous <span className="text-primary font-bold">turns complex supply chains</span> into growth engines with AI, predictive insights, and smart automation.
          </h2>
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-lg">
               <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-xl">JS</div>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg uppercase tracking-wider">James Smith</p>
              <p className="text-sm text-slate-500 font-medium">COO at GlobalLogistics</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
