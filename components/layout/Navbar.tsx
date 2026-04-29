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
            className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-[0.2em] hover:text-[#2292ce] transition-colors"
          >
            Home
          </Link>
          <Link
            href="#services"
            className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-[0.2em] hover:text-[#2292ce] transition-colors"
          >
            Expertise
          </Link>
          <Link
            href="#portfolio"
            className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-[0.2em] hover:text-[#2292ce] transition-colors"
          >
            Portfolio
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {mounted && isAuthenticated ? (
            <Link href="/dashboard">
              <button className="text-[10px] font-bold text-[#2292ce] uppercase tracking-[0.2em] px-6 py-3 border border-[#2292ce]/20 bg-[#2292ce]/5 hover:bg-[#2292ce]/10 transition-colors">
                Continue to Dashboard
              </button>
            </Link>
          ) : (
            <AdminLoginDrawer>
              <button className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-[0.2em] px-6 py-3 border border-[#0a0a0a]/10 hover:bg-slate-50 transition-colors">
                Admin Login
              </button>
            </AdminLoginDrawer>
          )}
          <BookingDrawer>
            <button className="bg-[#f7c20e] text-[#0a0a0a] px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#e5b30d] transition-colors shadow-lg shadow-yellow-500/10">
              Book a Session
            </button>
          </BookingDrawer>
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
                <button className="w-full text-[10px] font-bold text-[#2292ce] uppercase tracking-[0.2em] py-4 border border-[#2292ce]/10 bg-[#2292ce]/5">
                  Management Terminal
                </button>
              </Link>
            ) : (
              <AdminLoginDrawer>
                <button className="w-full text-[10px] font-bold text-[#0a0a0a] uppercase tracking-[0.2em] py-4 border border-[#0a0a0a]/10">
                  Admin Login
                </button>
              </AdminLoginDrawer>
            )}
            <BookingDrawer>
              <button className="w-full bg-[#f7c20e] text-[#0a0a0a] py-4 text-[10px] font-bold uppercase tracking-[0.2em]">
                Book a Session
              </button>
            </BookingDrawer>
          </div>
        </div>
      )}
    </nav>
  );
}

