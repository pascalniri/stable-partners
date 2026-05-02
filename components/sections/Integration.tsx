"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Integration() {
  return (
    <section className="p-0">
      <div className="container p-0 border-x border-slate-100">
        <div className="text-center py-24 border-b border-slate-100 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Seamless integration <br /> with Your Supply Chain
            </h2>
            <p className="text-slate-500 max-w-[600px] mx-auto text-md mb-10">
              Connect Luminous with your existing tools and ERP systems in
              minutes. No complex setup required.
            </p>
            <button className="btn-primary">View integrations</button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full bg-slate-50/50 p-12 md:p-24 border-b border-slate-100"
        >
          <div className="max-w-[1000px] mx-auto bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50">
            <Image
              src="/integration-diagram.png"
              alt="Integration Diagram"
              width={1000}
              height={750}
              className="w-full h-auto opacity-80"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
