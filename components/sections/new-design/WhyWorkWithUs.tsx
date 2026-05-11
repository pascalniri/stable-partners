"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Wrench, FileText } from "lucide-react";

const features = [
  {
    title: "1. Income optimization (not just management)",
    headline: "We actively improve property performance, not just maintain it:",
    bullets: [
      "rent pricing aligned to market demand",
      "reduced vacancy periods",
      "tenant retention strategies",
      "periodic yield optimization",
    ],
    icon: TrendingUp,
    color: "bg-[#1800AC]",
    lightColor: "bg-blue-50",
  },
  {
    title: "2. Operational efficiency",
    headline: "We handle day-to-day execution with structured systems:",
    bullets: [
      "tenant sourcing and screening",
      "rent collection and enforcement",
      "maintenance coordination",
      "lease administration",
      "Tax filing",
    ],
    icon: ShieldCheck,
    color: "bg-[#1800AC]",
    lightColor: "bg-blue-50",
  },
  {
    title: "3. Risk and problem prevention",
    headline: "We reduce common owner losses:",
    bullets: [
      "rent arrears and default risk",
      "property deterioration from poor upkeep",
      "legal and tenancy disputes",
      "inconsistent cash flow cycles",
    ],
    icon: Wrench,
    color: "bg-[#1800AC]",
    lightColor: "bg-blue-50",
  },
  {
    title: "4. Market intelligence advantage",
    headline: "Decisions are guided by data, not assumptions:",
    bullets: [
      "rental benchmarks by location",
      "occupancy trends",
      "demand shifts",
      "asset performance tracking",
    ],
    icon: FileText,
    color: "bg-[#1800AC]",
    lightColor: "bg-blue-50",
  },
];

export default function WhyWorkWithUs() {
  return (
    <section id="work-with-us" className="py-24 bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-3xl font-bold text-slate-900 mb-6"
          >
            WHAT WE DO
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-md text-slate-600"
          >
            If you register for our property management services, you will be
            able to boost your property rental income stress-free because we
            have identified the proven framework for transforming underperforming
            properties into high-yield assets.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-md bg-blue-50/50 border-slate-100 border hover:boder-slate-200 hover:shadow-blue-100/50 hover:-translate-y-2 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 ${feature.lightColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon
                  className={`w-7 h-7 ${feature.color.replace("bg-", "text-")}`}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
                {feature.title}
              </h3>
              <p className="text-slate-900 text-sm font-semibold mb-4 leading-relaxed">
                {feature.headline}
              </p>
              <ul className="space-y-2">
                {feature.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
