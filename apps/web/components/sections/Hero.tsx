"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { Search, Star } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="pt-20 pb-0 overflow-hidden bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#6ABAE9]/20 to-white pointer-events-none"></div>

      <div className="container relative z-10 px-0 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-[#0a0a0a]/10">
          
          {/* Headline Area */}
          <div className="lg:col-span-8 p-8 md:p-16 border-b border-[#0a0a0a]/10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#6ABAE9] font-bold mb-6 block">Expert Property Management</span>
              <h1 className="text-[42px] md:text-[64px] font-bold leading-[1.1] tracking-[-0.03em] text-[#0a0a0a] max-w-2xl">
                We Manage Your Properties. <br /> You Reclaim Your Time.
              </h1>
            </motion.div>
          </div>

          {/* Stats Area */}
          <div className="lg:col-span-4 p-8 md:p-12 border-b lg:border-l border-[#0a0a0a]/10 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-widest text-[#737373] font-semibold">Rent Collection</p>
                <p className="text-3xl font-bold text-[#0a0a0a]">99.2%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-widest text-[#737373] font-semibold">Asset Value</p>
                <p className="text-3xl font-bold text-[#0a0a0a]">$240M+</p>
              </div>
            </motion.div>
            <p className="text-[13px] text-[#737373] leading-relaxed mt-12">
              From chasing late payments to managing complex repairs, we take the stress out of property ownership.
            </p>
          </div>

          {/* Image Area */}
          <div className="lg:col-span-12 relative aspect-[21/9] overflow-hidden border-b border-[#0a0a0a]/10 group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="w-full h-full"
            >
              <Image
                src="/building-image.png"
                alt="Modern Building"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                priority
              />
            </motion.div>
            
            {/* Overlay Info Card */}
            <div className="absolute bottom-0 right-0 bg-white p-8 md:p-12 border-l border-t border-[#0a0a0a]/10 max-w-sm hidden md:block">
               <div className="space-y-4">
                 <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#0a0a0a]">Social Proof</p>
                 <div className="flex gap-1 items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#0a0a0a" stroke="#0a0a0a" />
                    ))}
                    <span className="text-[12px] font-bold ml-2">5.0</span>
                 </div>
                 <p className="text-[13px] text-[#737373] leading-relaxed">
                   Join over 250+ property owners who trust us with their high-value assets.
                 </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
