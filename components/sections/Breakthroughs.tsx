"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Target } from "lucide-react";

const breakthroughs = [
  {
    title: "Efficiency",
    value: "+45%",
    desc: "Increase in operational throughput.",
    icon: TrendingUp,
  },
  {
    title: "Speed",
    value: "-30%",
    desc: "Reduction in order fulfillment time.",
    icon: Clock,
  },
  {
    title: "Accuracy",
    value: "99.9%",
    desc: "Inventory precision across all warehouses.",
    icon: Target,
  },
];

export default function Breakthroughs() {
  return (
    <section className="p-0">
      <div className="container p-0 border-x border-slate-100">
        <div className="text-center py-24 border-b border-slate-100 px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Data-Driven Supply <br /> Chain Breakthroughs
          </h2>
          <p className="text-slate-500 max-w-[600px] mx-auto text-md">
            Our platform delivers measurable results that impact your bottom
            line.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {breakthroughs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-16 flex flex-col items-center text-center border-b border-slate-100 ${i < 2 ? "md:border-r" : ""}`}
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-primary mb-8 border border-slate-100">
                <item.icon size={28} />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                {item.title}
              </h3>
              <p className="text-6xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tighter">
                {item.value}
              </p>
              <p className="text-slate-500 text-md leading-relaxed max-w-[200px]">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-[1000px] mx-auto text-center py-24 px-6 border-b border-slate-100"
        >
          <p className="text-2xl md:text-3xl  text-slate-600 mb-10 leading-relaxed font-serif">
            "We've seen a massive shift in how we handle disruptions. Luminous
            gives us the clarity we need to make split-second decisions with
            confidence."
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              SJ
            </div>
            <p className="font-bold text-slate-900 uppercase tracking-wider">
              Sarah Jenkins, VP of Operations
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
