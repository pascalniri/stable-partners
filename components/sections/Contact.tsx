'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    serviceType: 'Consultancy',
    description: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ customerName: '', customerEmail: '', serviceType: 'Consultancy', description: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="bg-card relative overflow-hidden">
      <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,var(--primary-glow)_0%,transparent_70%)] blur-[80px] opacity-40 z-0"></div>
      
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">
        <div className="max-w-[500px]">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to <span className="gradient-text">Stabilize</span> Your Future?
          </motion.h2>
          <p className="text-lg text-foreground/70 leading-relaxed mb-10">
            Take the first step towards a more robust property portfolio. Book your initial consultation with our expert team today.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center text-primary shadow-sm">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Email Us</p>
                <p className="font-bold">hello@stablepartners.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center text-primary shadow-sm">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Call Us</p>
                <p className="font-bold">+1 (555) 000-STABLE</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center text-primary shadow-sm">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Our Office</p>
                <p className="font-bold">123 Advisory Lane, New York, NY</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background p-8 md:p-12 rounded-[2.5rem] border border-border shadow-2xl">
          {status === 'success' ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Request Received!</h3>
              <p className="text-foreground/70 mb-8">Check your email for a "Thank You" message from us. We will be in touch shortly.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold transition-all hover:bg-secondary"
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold opacity-80">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="p-4 bg-card border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold opacity-80">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="p-4 bg-card border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" 
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold opacity-80">Service Interested In</label>
                <select 
                  className="p-4 bg-card border border-border rounded-xl focus:outline-none focus:border-primary transition-all"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                >
                  <option>Portfolio Strategy</option>
                  <option>Operational Excellence</option>
                  <option>Risk Management</option>
                  <option>Market Analytics</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold opacity-80">Tell us about your needs</label>
                <textarea 
                  rows={4} 
                  placeholder="I'm looking to optimize my multi-family portfolio..." 
                  className="p-4 bg-card border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="mt-4 p-4 bg-primary text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:bg-secondary hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Schedule Consultation'}
                <Send size={18} />
              </button>
              {status === 'error' && (
                <p className="text-red-500 text-sm mt-2 text-center">Something went wrong. Please try again.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
