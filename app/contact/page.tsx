import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us | Stable Partners Group',
  description: 'Get in touch with Stable Partners Group.',
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Contact Us</h1>
          <p className="text-slate-600 text-lg mb-12">
            Have questions about Stable Partners Group or want to learn more about how we work? Reach out to our team.
          </p>
          
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 inline-block w-full">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Email Us</h2>
            <Link href="mailto:hello@stablepartnersgroup.com" className="text-xl md:text-2xl font-semibold text-[#1800AC] hover:underline break-all">
              hello@stablepartnersgroup.com
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
