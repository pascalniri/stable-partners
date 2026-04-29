'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, BarChart3, ShieldCheck, ArrowUpRight, Users2, Layers } from 'lucide-react';

const services = [
  {
    title: 'Portfolio Strategy',
    description: 'We develop comprehensive long-term strategies to optimize your property portfolio growth and stability.',
    icon: <Layers size={24} />,
  },
  {
    title: 'Operational Excellence',
    description: 'Streamline your day-to-day management with our proven frameworks for efficiency and cost reduction.',
    icon: <Building2 size={24} />,
  },
  {
    title: 'Risk Management',
    description: 'Protect your assets with advanced risk assessment and mitigation strategies tailored to your market.',
    icon: <ShieldCheck size={24} />,
  },
  {
    title: 'Market Analytics',
    description: 'Make informed decisions with our deep-dive data analysis and predictive market trend reporting.',
    icon: <BarChart3 size={24} />,
  },
  {
    title: 'Tenant Relations',
    description: 'Enhance retention and satisfaction through professional communication and dispute resolution frameworks.',
    icon: <Users2 size={24} />,
  },
  {
    title: 'Growth Acceleration',
    description: 'Identify and capitalize on new acquisition opportunities to rapidly expand your property footprint.',
    icon: <ArrowUpRight size={24} />,
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-background relative">
      <div className="container">
        <div className="text-center mb-20">
          <span className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-4 block">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">Tailored Consultancy <br />for the <span className="gradient-text">Modern Landlord</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card p-10 rounded-[2rem] border border-border transition-all duration-500 hover:-translate-y-3 hover:border-primary hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] flex flex-col gap-6"
            >
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold">{service.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{service.description}</p>
              <div className="mt-auto flex items-center gap-2 font-bold text-sm text-primary cursor-pointer group-hover:text-secondary transition-colors">
                Explore Detail <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
