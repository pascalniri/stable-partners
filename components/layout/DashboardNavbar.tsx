"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { LogOut, RefreshCcw, Menu, X } from "lucide-react";

interface DashboardNavbarProps {
  currentPath: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function DashboardNavbar({
  currentPath,
  onRefresh,
  isLoading = false,
}: DashboardNavbarProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Bookings" },
    { href: "/dashboard/properties", label: "Managed Assets" },
    { href: "/dashboard/sessions", label: "Strategy Sessions" },
  ];

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-6 relative">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex-1 flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 bg-[#1800AC] rounded-[10px] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold uppercase tracking-widest text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Stable Partners Group
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-bold uppercase tracking-widest pb-1 transition-colors ${
                  isActive
                    ? "text-[#1800AC] border-b-2 border-[#1800AC]"
                    : "text-slate-400 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="flex-1 hidden md:flex items-center justify-end gap-6 shrink-0">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#1800AC] hover:bg-blue-50 rounded-[10px] transition-all"
              title="Refresh Data"
            >
              <RefreshCcw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 px-4 py-2 rounded-[10px] transition-all"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-4 shrink-0">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-slate-400 hover:text-[#1800AC]"
            >
              <RefreshCcw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-900 hover:bg-slate-50 rounded-[10px] transition-all"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-bold uppercase tracking-widest p-3 rounded-[10px] ${
                    isActive
                      ? "bg-blue-50 text-[#1800AC]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="h-px bg-slate-100 my-2" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-red-500 p-3 hover:bg-red-50 rounded-[10px] transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
