'use client';

import React from 'react';
import { Twitter, Linkedin, Github, Mail, Box } from 'lucide-react';

import { AdminLoginDrawer } from '../drawers/AdminLoginDrawer';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#0a0a0a]/10 py-0">
      <div className="container px-0 md:px-6">
        {/* ... (grid content remains the same) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-x border-[#0a0a0a]/10">
          <div className="p-10 border-b md:border-r border-[#0a0a0a]/10 flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-sm font-bold tracking-[0.2em] text-[#0a0a0a] uppercase">STABLE PARTNERS</span>
            </div>
            <p className="text-[#737373] text-[12px] leading-relaxed max-w-xs">
              Boutique property management for the high-value asset owner. Reclaiming time through radical transparency.
            </p>
          </div>

          <div className="p-10 border-b lg:border-r border-[#0a0a0a]/10">
            <h4 className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-[0.3em] mb-8">Expertise</h4>
            <ul className="flex flex-col gap-4 text-[11px] font-medium text-[#737373]">
              {['Strategy', 'Operations', 'Compliance', 'Growth'].map(item => (
                <li key={item}><a href="#" className="hover:text-[#6ABAE9] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="p-10 border-b md:border-r border-[#0a0a0a]/10">
            <h4 className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-[0.3em] mb-8">Journal</h4>
            <ul className="flex flex-col gap-4 text-[11px] font-medium text-[#737373]">
              {['Market Insights', 'Legal Updates', 'Asset Reports', 'Methodology'].map(item => (
                <li key={item}><a href="#" className="hover:text-[#6ABAE9] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="p-10 border-b border-[#0a0a0a]/10">
            <h4 className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-[0.3em] mb-8">Pulse</h4>
            <div className="flex gap-6">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <a key={i} href="#" className="text-[#a3a3a3] hover:text-[#0a0a0a] transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-x border-b border-[#0a0a0a]/10 p-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-[#a3a3a3] uppercase tracking-[0.2em]">
          <p>&copy; 2026 Stable Partners.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-[#0a0a0a]">Terms</a>
            <a href="#" className="hover:text-[#0a0a0a]">Privacy</a>
            <AdminLoginDrawer>
              <button className="hover:text-[#6ABAE9] transition-colors cursor-pointer">Admin Portal</button>
            </AdminLoginDrawer>
          </div>
        </div>
      </div>
    </footer>
  );
}


