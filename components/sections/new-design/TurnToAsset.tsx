"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function TurnToAsset() {
  return (
    <section className="py-24 bg-blue-50/50 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative aspect-square max-w-lg mx-auto rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-white rounded-full blur-2xl" />
              <Image
                src="/Rental-Properties-for-Passive-Income.webp"
                alt="How it works"
                fill
                className="object-cover h-full w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
              Are you ready to turn your Rental property into a{" "}
              <span className="text-[#1800AC]">high performing</span> passive
              income asset?
            </h2>

            <p className="text-md text-slate-600 mb-10 leading-relaxed">
              The performance of a property is often the defining factor in the
              success of a real estate investment. Without structured
              management, properties tend to underperform through poor tenant
              selection, prolonged vacancies, and missed opportunities to
              optimize returns blending into the broader market without reaching
              their full potential.
            </p>
            <p className="text-md text-slate-600 mb-10 leading-relaxed">
              That’s where our free private one on one call comes in. Identify
              where your property is underperforming. At the end, you’ll receive
              a clear breakdown of gaps and tailored action steps you can take
              immediately to improve tenant quality, reduce vacancies, and
              increase your rental returns.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("registration-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group text-xs tracking-widest relative px-8 py-4 bg-[#1800AC] text-white rounded font-bold transition-all hover:bg-blue-700 active:scale-95 flex items-center justify-center gap-2"
            >
              BOOK A FREE ASSESSMENT CALL
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
