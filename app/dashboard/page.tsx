"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAdmin, Booking } from "../../hooks/useAdmin";
import { useAuth } from "../../hooks/useAuth";
import {
  LogOut,
  RefreshCcw,
  ExternalLink,
  Calendar,
  Mail,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const { bookings, isLoading, error, refresh } = useAdmin();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-[#1800AC] selection:text-white">
      {/* Header Nav */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-10">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#1800AC] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                Admin Dashboard
              </h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Stable Partners Group
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/dashboard"
              className="text-xs font-bold uppercase tracking-widest text-[#1800AC] border-b-2 border-[#1800AC] pb-1"
            >
              Bookings
            </Link>
            <Link
              href="/dashboard/properties"
              className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors pb-1"
            >
              Managed Assets
            </Link>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <button
              onClick={() => refresh()}
              className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#1800AC] hover:bg-blue-50 rounded-lg transition-all"
              title="Refresh Data"
            >
              <RefreshCcw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900">
            Inquiry Overview
          </h2>
          <p className="text-slate-500 mt-1">
            Monitor and manage property performance assessments.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Total Captured
              </span>
              <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <RefreshCcw size={14} />
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900">
              {bookings.length}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Updated just now
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Pending Review
              </span>
              <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                <RefreshCcw size={14} />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#1800AC]">
              {bookings.filter((b) => b.status === "PENDING").length}
            </div>
            <p className="text-xs text-orange-500 mt-2 font-medium">
              Requires attention
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Action Rate
              </span>
              <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                <RefreshCcw size={14} />
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-900">
              {bookings.length > 0
                ? Math.round(
                    (bookings.filter((b) => b.status !== "PENDING").length /
                      bookings.length) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-emerald-500 mt-2 font-medium">
              System performance
            </p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-bold text-slate-900">
              Active Inquiries
            </h3>
            <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase bg-slate-50 px-3 py-1 rounded-full">
              Sync: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50">
                    Timestamp
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50">
                    Identity
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50">
                    Service Parameter
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50">
                    Status
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading && bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-20 text-center text-sm font-medium text-slate-400"
                    >
                      Initializing Data Stream...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-20 text-center text-sm font-medium text-slate-400"
                    >
                      No active inquiries detected in system.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-slate-50/30 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="text-xs font-semibold text-slate-900">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] font-medium text-slate-400 mt-1 uppercase">
                          {new Date(booking.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1800AC]">
                            <User size={18} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                              {booking.customerName}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <Mail size={12} className="text-slate-400" />{" "}
                              {booking.customerEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-widest">
                          {booking.serviceType}
                        </span>
                        {booking.description && (
                          <p className="text-[11px] text-slate-500 mt-2 line-clamp-1 max-w-xs italic">
                            "{booking.description}"
                          </p>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              booking.status === "PENDING"
                                ? "bg-orange-400 animate-pulse"
                                : "bg-emerald-400"
                            }`}
                          />
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest ${
                              booking.status === "PENDING"
                                ? "text-orange-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          {booking.status === "PENDING" ? (
                            <Link
                              href={`/dashboard/bookings/${booking.id}`}
                              className="px-4 py-2 bg-blue-50 text-[#1800AC] text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#1800AC] hover:text-white transition-all flex items-center gap-2"
                            >
                              Process <ExternalLink size={12} />
                            </Link>
                          ) : (
                            <Link
                              href={`/dashboard/bookings/${booking.id}`}
                              className="px-4 py-2 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2"
                            >
                              Review <Calendar size={12} />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
