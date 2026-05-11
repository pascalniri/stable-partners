"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function PropertyHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-1/4 pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#1800AC] text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#1800AC] animate-pulse" />
              Expert Property Management
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] text-slate-900 mb-6">
              Are you frustrated that your property is costing you stress
              instead of generating high, passive income?{" "}
            </h1>

            <p className="text-md text-slate-600 leading-relaxed mb-10 max-w-xl">
              Our personal touch takes the stress out of property management,
              providing you with high-quality tenants, regular property
              inspections, and a team of dedicated experts who treat your
              investment as their own.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  document
                    .getElementById("registration-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group text-xs tracking-widest relative px-8 py-4 bg-[#1800AC] text-white rounded font-bold transition-all hover:bg-blue-700 active:scale-95 flex items-center justify-center gap-2"
              >
                TALK TO AN EXPERT
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex flex-col justify-center space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <p className="text-sm font-semibold text-slate-900">
                    It's Completely Free
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <p className="text-sm font-semibold text-slate-900">
                    Takes less than 60 seconds to register
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-[#1800AC]/5 rounded-full scale-110 blur-3xl" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-white shadow-2xl">
                <Image
                  src="/20680.jpg"
                  alt="Struggling with Property Management?"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    Income Boost
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    +24% Average
                  </p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1800AC]">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    Time Saved
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    15+ Hours/Week
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
