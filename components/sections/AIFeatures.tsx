"use client";

import React from "react";
import { motion } from "framer-motion";
import { Banknote, Hammer, Users, ShieldCheck, Clock, LineChart } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Rent Collection",
    desc: "Stop chasing payments. We handle automated rent collection and ensure funds reach your account on time, every time.",
    icon: Banknote,
  },
  {
    id: 2,
    title: "Maintenance & Repairs",
    desc: "From leaky faucets to major overhauls, our network of trusted contractors handles every repair so you don't have to.",
    icon: Hammer,
  },
  {
    id: 3,
    title: "Tenant Relations",
    desc: "We act as the primary point of contact for all tenant inquiries, managing everything from screening to move-outs.",
    icon: Users,
  },
  {
    id: 4,
    title: "Legal & Compliance",
    desc: "Stay protected with our expert knowledge of local housing laws, contract management, and regulatory filings.",
    icon: ShieldCheck,
  },
  {
    id: 5,
    title: "24/7 Emergency Response",
    desc: "Emergencies don't wait for business hours. Our team is available round-the-clock to handle urgent property issues.",
    icon: Clock,
  },
  {
    id: 6,
    title: "Financial Reporting",
    desc: "Track your investment performance with detailed monthly statements and real-time financial dashboards.",
    icon: LineChart,
  },
];

export default function ManagementServices() {
  return (
    <section id="services" className="py-0 bg-white border-b border-[#0a0a0a]/10">
      <div className="container px-0 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-x border-[#0a0a0a]/10">
          
          {/* Section Header Card */}
          <div className="md:col-span-2 lg:col-span-3 p-12 md:p-20 border-b border-[#0a0a0a]/10">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#6ABAE9] font-bold mb-6 block">Our Methodology</span>
              <h2 className="text-md font-semibold text-[#0a0a0a] mb-8 tracking-tight leading-none">
                Radical Transparency. <br /> Clinical Precision.
              </h2>
              <p className="text-[#737373] text-[15px] leading-relaxed max-w-xl">
                We handle the day-to-day stress of property ownership—chasing rent, fixing repairs, and managing tenants—so you can enjoy the rewards of your investment.
              </p>
            </div>
          </div>

          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group p-10 md:p-12 border-b border-[#0a0a0a]/10 transition-colors hover:bg-slate-50 ${
                (index + 1) % 3 === 0 ? 'lg:border-r-0' : 'lg:border-r'
              } ${
                index >= services.length - 3 ? 'lg:border-b-0' : ''
              }`}
            >
              <div className="text-[10px] font-bold text-[#6ABAE9] mb-8 uppercase tracking-[0.2em]">0{service.id} / Service</div>
              
              <div className="w-10 h-10 text-[#0a0a0a] mb-8 group-hover:scale-110 transition-transform duration-500">
                <service.icon size={32} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-[18px] font-bold text-[#0a0a0a] mb-4 uppercase tracking-tight">{service.title}</h3>
              <p className="text-[#737373] text-[13px] leading-relaxed mb-10 min-h-[60px]">
                {service.desc}
              </p>
              
              <div className="pt-6 border-t border-[#0a0a0a]/5">
                <button className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-[0.2em] flex items-center gap-4 group/btn">
                  Explore Parameters
                  <span className="text-[#6ABAE9] group-hover:translate-x-2 transition-transform">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
