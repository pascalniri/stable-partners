"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { useAuth } from "../../../../hooks/useAuth";
import { useProperties } from "../../../../hooks/useProperties";
import { ArrowLeft, Calendar, Link as LinkIcon, Send, User, Mail, MessageSquare, ShieldCheck } from "lucide-react";

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { bookings, isLoading: isAdminLoading, isSubmitting, isSuccess, replyToBooking } = useAdmin();
  const { properties, isLoading: isPropsLoading } = useProperties();
  
  // Find the specific booking
  const booking = bookings.find(b => b.id === id);

  // If the booking has a propertyId but the relation is missing, find it in the properties list
  const linkedProperty = booking?.property || (booking?.propertyId ? properties.find(p => p.id === booking.propertyId) : null);

  const isLoading = isAdminLoading || isPropsLoading;

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => router.push("/dashboard"), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  const [scheduledDate, setScheduledDate] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [message, setMessage] = useState("Looking forward to our session!");

  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  if (isLoading && !booking) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.4em] animate-pulse">Synchronizing Data...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center gap-8">
        <div className="text-[10px] uppercase tracking-[0.4em] text-red-500">Resource Not Found</div>
        <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1">Return to Terminal</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#0a0a0a] font-sans">
      <div className="container mx-auto px-8 py-12">
        {/* Navigation */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#737373] hover:text-[#0a0a0a] transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Bookings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Lead Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-[#0a0a0a]/5 p-12 shadow-sm">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#6ABAE9] font-bold mb-4 block">Inquiry Profile</span>
                  <h1 className="text-3xl font-semibold tracking-tight">{booking.customerName}</h1>
                </div>
                <div className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest border ${
                  booking.status === "PENDING" ? "border-orange-200 text-orange-600 bg-orange-50" : "border-emerald-200 text-emerald-600 bg-emerald-50"
                }`}>
                  {booking.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#a3a3a3] font-bold">Electronic Mail</span>
                  <div className="text-sm font-medium flex items-center gap-2">
                    <Mail size={14} className="text-[#6ABAE9]" /> {booking.customerEmail}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#a3a3a3] font-bold">Service Parameter</span>
                  <div className="text-sm font-medium flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#6ABAE9]" /> {booking.serviceType}
                  </div>
                </div>
                {booking.customerPhone && (
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#a3a3a3] font-bold">Direct Contact Protocol</span>
                    <div className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare size={14} className="text-[#6ABAE9]" /> {booking.customerPhone}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-12 border-t border-[#0a0a0a]/5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#a3a3a3] font-bold">Lead Narrative</span>
                <p className="text-md text-[#404040] leading-relaxed italic bg-slate-50 p-8 border-l-2 border-[#6ABAE9]">
                  "{booking.description || "No additional context provided by lead."}"
                </p>
              </div>

              {linkedProperty && (
                <div className="mt-12 pt-12 border-t border-[#0a0a0a]/5">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#6ABAE9] font-bold mb-6 block">Linked Portfolio Asset</span>
                  <div className="flex gap-8 bg-slate-50/50 p-6 border border-[#0a0a0a]/5 group hover:bg-white transition-all duration-500">
                    <div className="w-24 h-24 relative flex-shrink-0 overflow-hidden border border-[#0a0a0a]/10">
                      <img 
                        src={linkedProperty.images[0] || ""} 
                        alt={linkedProperty.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-[12px] font-bold uppercase tracking-tight text-[#0a0a0a] mb-1">{linkedProperty.title}</h4>
                      <p className="text-[10px] text-[#737373] uppercase tracking-widest flex items-center gap-2">
                        <LinkIcon size={10} /> {linkedProperty.location}
                      </p>
                      <div className="mt-3 flex gap-4">
                        <span className="text-[9px] font-bold text-[#6ABAE9] uppercase tracking-tighter bg-[#6ABAE9]/5 px-2 py-0.5">
                          {linkedProperty.bedrooms} Beds
                        </span>
                        <span className="text-[9px] font-bold text-[#6ABAE9] uppercase tracking-tighter bg-[#6ABAE9]/5 px-2 py-0.5">
                          {linkedProperty.bathrooms} Baths
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Response Protocol */}
          <div className="space-y-8">
            <div className="bg-white border border-[#0a0a0a]/5 p-12 shadow-sm sticky top-12">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#6ABAE9] font-bold mb-8 block">Reply</span>
              
              {isSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={24} />
                  </div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-2">Transmission Successful.</h2>
                  <p className="text-[10px] text-[#737373] uppercase tracking-widest">Redirecting to Terminal...</p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    replyToBooking(booking.id, { scheduledDate, meetingLink, message });
                  }} 
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={12} /> Schedule Date
                    </label>
                    <input 
                      required
                      type="datetime-local" 
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full bg-slate-50 border border-[#0a0a0a]/5 p-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-[#6ABAE9] transition-colors"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                      <LinkIcon size={12} /> Virtual Link
                    </label>
                    <input 
                      required
                      type="url" 
                      placeholder="https://meet.google.com/..."
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="w-full bg-slate-50 border border-[#0a0a0a]/5 p-4 text-xs font-medium outline-none focus:border-[#6ABAE9] transition-colors"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={12} /> Communication
                    </label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Personalized message to lead..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-[#0a0a0a]/5 p-4 text-xs font-medium outline-none focus:border-[#6ABAE9] transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={isSubmitting}
                      type="submit" 
                      className="w-full bg-[#0a0a0a] text-white py-4 text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-slate-800 transition-colors disabled:bg-slate-400 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? "Processing..." : <>Initiate Response <Send size={14} /></>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
