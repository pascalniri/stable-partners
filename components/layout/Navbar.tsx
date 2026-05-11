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
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <Image
            src="/stable-partners-group-logo.png"
            alt="Stable Partners Group Logo"
            width={80}
            height={80}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          <Link
            href="/"
            className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em] hover:text-[#1800AC] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/#work-with-us"
            className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em] hover:text-[#1800AC] transition-colors"
          >
            What We Do
          </Link>
          <Link
            href="/#registration-form"
            className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.2em] hover:text-[#1800AC] transition-colors"
          >
            Assessment
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {mounted && isAuthenticated ? (
            <Link href="/dashboard">
              <button className="text-[11px] font-bold text-[#1800AC] uppercase tracking-[0.2em] px-6 py-3 border border-[#1800AC]/20 bg-blue-50 hover:bg-blue-100 transition-all rounded">
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
          <Link
            href="/#registration-form"
            className="bg-[#1800AC] text-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 rounded text-center inline-block"
          >
            TALK TO AN EXPERT
          </Link>
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
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]"
          >
            Home
          </Link>
          <Link 
            href="/#work-with-us" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]"
          >
            What We Do
          </Link>
          <Link 
            href="/#registration-form" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]"
          >
            Assessment
          </Link>
          
          <div className="flex flex-col gap-4 mt-4">
            {mounted && isAuthenticated ? (
              <Link href="/dashboard">
                <button className="w-full text-[11px] font-bold text-[#1800AC] uppercase tracking-[0.2em] py-4 border border-[#1800AC]/10 bg-blue-50 rounded">
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
            <Link
              href="/#registration-form"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full bg-[#1800AC] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded text-center block"
            >
              TALK TO AN EXPERT
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
