"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Users } from "lucide-react";

export default function TrustSection() {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full grid-bg" />
      </div>

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-xl md:text-3xl font-bold mb-8 text-white uppercase tracking-wider">
            Our Foundation of Trust
          </h2>
          <p className="text-sm text-slate-300 mb-16 leading-relaxed">
            The firm is founded on direct involvement in real estate development
            and property management projects exceeding RWF 6Billion in asset
            value, including leasing coordination, transaction facilitation, and
            operational oversight. That experience provides a practical
            understanding of how rental income is lost or improved in real
            conditions, not theory.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1800AC] rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold mb-2">5+ Years</h4>
              <p className="text-slate-400">Industry Experience</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1800AC] rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold mb-2">100% Reliable</h4>
              <p className="text-slate-400">Guaranteed Compliance</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1800AC] rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold mb-2">RDB Registered</h4>
              <p className="text-slate-400">Official Registration</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}