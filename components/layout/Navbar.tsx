"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Box } from "lucide-react";
import Link from "next/link";
import { BookingDrawer } from "../drawers/BookingDrawer";
import { AdminLoginDrawer } from "../drawers/AdminLoginDrawer";
import { useAuth } from "../../hooks/useAuth";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-white h-20 flex items-center`}
    >
      <div className="container flex items-center justify-between bg-white">
        <div className="flex items-center gap-2 group cursor-pointer">
         <Image src="/stable-partners-group - logo.png" alt="Stable Partners Group Logo" width={200} height={200} />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          <Link
            href="#"
            className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            href="#how-it-works"
            className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#registration-form"
            className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors"
          >
            Assessment
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {mounted && isAuthenticated ? (
            <Link href="/dashboard">
              <button className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em] px-6 py-3 border border-blue-600/20 bg-blue-50 hover:bg-blue-100 transition-all rounded">
                Dashboard
              </button>
            </Link>
          ) : (
            <AdminLoginDrawer>
              <button className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em] px-6 py-3 border border-slate-200 hover:bg-slate-50 transition-all rounded">
                Admin
              </button>
            </AdminLoginDrawer>
          )}
          <button 
            onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 text-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 rounded"
          >
            Free Assessment
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white p-8 flex flex-col gap-6 border-b border-gray-100 shadow-xl md:hidden">
          <Link href="#" className="text-base font-semibold text-slate-900">
            Home
          </Link>
          <Link href="#" className="text-base font-semibold text-slate-900">
            Buy
          </Link>
          <Link href="#" className="text-base font-semibold text-slate-900">
            Rent
          </Link>
          <Link
            href="#contact"
            className="text-base font-semibold text-slate-900"
          >
            Connect
          </Link>
          <div className="flex flex-col gap-4 mt-4">
            {mounted && isAuthenticated ? (
              <Link href="/dashboard">
                <button className="w-full text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em] py-4 border border-blue-600/10 bg-blue-50 rounded">
                  Dashboard
                </button>
              </Link>
            ) : (
              <AdminLoginDrawer>
                <button className="w-full text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em] py-4 border border-slate-200 rounded">
                  Admin Login
                </button>
              </AdminLoginDrawer>
            )}
            <button 
              onClick={() => {
                document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-blue-600 text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded"
            >
              Free Assessment
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

