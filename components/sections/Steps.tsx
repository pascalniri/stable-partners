"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Connect Your Data",
    desc: "Easily sync your ERP, TMS, and warehouse management systems with our secure API.",
  },
  {
    number: "02",
    title: "Configure Your Workflow",
    desc: "Define your business rules and let our AI optimize your supply chain processes.",
  },
  {
    number: "03",
    title: "Monitor & Optimize",
    desc: "Watch as Luminous identifies savings and improves performance in real-time.",
  },
];

export default function Steps() {
  return (
    <section className="p-0">
      <div className="container p-0 border-x border-slate-100">
        <div className="text-center py-24 border-b border-slate-100 px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Kickstart your business <br /> optimization in 3 easy steps
          </h2>
          <p className="text-slate-500 max-w-[600px] mx-auto text-md">
            Implementation is fast, simple, and guided by our expert team.
          </p>
        </div>

        <div className="flex flex-col">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row items-center gap-12 p-12 md:p-24 border-b border-slate-100 group hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <span className="text-8xl md:text-9xl font-bold text-slate-100 leading-none group-hover:text-primary/10 transition-colors">
                  {step.number}
                </span>
              </div>
              <div className="max-w-[600px] text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-md leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}

          <div className="py-24 text-center px-6">
            <button className="btn-primary text-xl">Get Started Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
