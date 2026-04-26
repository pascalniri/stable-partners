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
    <div className="min-h-screen bg-[#F8F8F8] text-[#0a0a0a] font-sans selection:bg-[#6ABAE9] selection:text-white">
      {/* Sidebar / Header Nav */}
      <header className="bg-white border-b border-[#0a0a0a]/5 sticky top-0 z-50">
        <div className="container mx-auto px-8 h-20 flex items-center justify-between">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-4 cursor-pointer"
          >
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <div>
              <h1 className="text-[11px] font-bold uppercase tracking-[0.4em]">
                Admin Dashboard
              </h1>
              <p className="text-[10px] text-[#737373] uppercase tracking-[0.2em] mt-1">
                Stable Partners Group
              </p>
            </div>
          </div>

          <div className="flex items-center gap-12 ml-20">
            <Link
              href="/dashboard"
              className="text-[10px] font-bold uppercase tracking-[0.3em] border-b-2 border-black pb-1"
            >
              Bookings
            </Link>
            <Link
              href="/dashboard/properties"
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors pb-1"
            >
              Managed Assets
            </Link>
          </div>

          <div className="flex items-center gap-8 ml-auto">
            <button
              onClick={() => refresh()}
              className="p-2 text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors"
              title="Refresh Data"
            >
              <RefreshCcw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 border border-[#0a0a0a]/5 shadow-sm">
            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-[0.3em] mb-4 block">
              Total Captured
            </span>
            <div className="text-4xl font-light tracking-tighter">
              {bookings.length}
            </div>
          </div>
          <div className="bg-white p-8 border border-[#0a0a0a]/5 shadow-sm">
            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-[0.3em] mb-4 block">
              Pending Review
            </span>
            <div className="text-4xl font-light tracking-tighter text-[#6ABAE9]">
              {bookings.filter((b) => b.status === "PENDING").length}
            </div>
          </div>
          <div className="bg-white p-8 border border-[#0a0a0a]/5 shadow-sm">
            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-[0.3em] mb-4 block">
              Action Rate
            </span>
            <div className="text-4xl font-light tracking-tighter">
              {bookings.length > 0
                ? Math.round(
                    (bookings.filter((b) => b.status !== "PENDING").length /
                      bookings.length) *
                      100,
                  )
                : 0}
              %
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white border border-[#0a0a0a]/5 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-[#0a0a0a]/5 flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em]">
              Active Inquiries
            </h2>
            <div className="text-[10px] text-[#a3a3a3] font-mono tracking-widest uppercase">
              System Sync: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fafafa]">
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373] border-b border-[#0a0a0a]/5">
                    Timestamp
                  </th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373] border-b border-[#0a0a0a]/5">
                    Identity
                  </th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373] border-b border-[#0a0a0a]/5">
                    Service Parameter
                  </th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373] border-b border-[#0a0a0a]/5">
                    Status
                  </th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373] border-b border-[#0a0a0a]/5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0a0a0a]/5">
                {isLoading && bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-20 text-center text-[11px] uppercase tracking-widest text-[#a3a3a3]"
                    >
                      Initializing Data Stream...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-20 text-center text-[11px] uppercase tracking-widest text-[#a3a3a3]"
                    >
                      No active inquiries detected in protocol.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-[#fcfcfc] transition-colors group"
                    >
                      <td className="p-6">
                        <div className="text-[11px] font-medium text-[#737373]">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-[9px] font-mono text-[#a3a3a3] mt-1 uppercase">
                          {new Date(booking.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#737373]">
                            <User size={14} />
                          </div>
                          <div>
                            <div className="text-[12px] font-bold uppercase tracking-tight">
                              {booking.customerName}
                            </div>
                            <div className="text-[11px] text-[#737373] flex items-center gap-1">
                              <Mail size={10} /> {booking.customerEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-[10px] px-2 py-1 bg-slate-100 text-[#737373] font-bold uppercase tracking-widest rounded-sm">
                          {booking.serviceType}
                        </span>
                        {booking.description && (
                          <p className="text-[11px] text-[#737373] mt-2 line-clamp-1 max-w-xs italic">
                            "{booking.description}"
                          </p>
                        )}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              booking.status === "PENDING"
                                ? "bg-orange-400"
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
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          {booking.status === "PENDING" ? (
                            <Link
                              href={`/dashboard/bookings/${booking.id}`}
                              className="text-[10px] font-bold uppercase tracking-widest text-[#6ABAE9] hover:text-[#5aa9d8] transition-colors flex items-center gap-2"
                            >
                              Process Inquiry <ExternalLink size={12} />
                            </Link>
                          ) : (
                            <Link
                              href={`/dashboard/bookings/${booking.id}`}
                              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors"
                            >
                              Review Details <Calendar size={12} />
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
