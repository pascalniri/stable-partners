"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAdmin } from "../../../../hooks/useAdmin";
import { useAuth } from "../../../../hooks/useAuth";
import { useProperties } from "../../../../hooks/useProperties";
import {
  ArrowLeft,
  Calendar,
  Link as LinkIcon,
  Send,
  User,
  Mail,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Trash2,
} from "lucide-react";

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    bookings,
    isLoading: isAdminLoading,
    isSubmitting,
    isSuccess,
    replyToBooking,
    declineBooking,
  } = useAdmin();
  const { properties, isLoading: isPropsLoading } = useProperties();

  // Find the specific booking
  const booking = bookings.find((b) => b.id === id);

  // If the booking has a propertyId but the relation is missing, find it in the properties list
  const linkedProperty =
    booking?.property ||
    (booking?.propertyId
      ? properties.find((p) => p.id === booking.propertyId)
      : null);

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

  // Pre-fill if slot exists
  useEffect(() => {
    if (booking?.slot) {
      setScheduledDate(booking.slot.startTime);
    }
  }, [booking]);

  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  if (isLoading && !booking) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.4em] animate-pulse">
          Synchronizing Data...
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center gap-8">
        <div className="text-[10px] uppercase tracking-[0.4em] text-red-500">
          Resource Not Found
        </div>
        <Link
          href="/dashboard"
          className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1"
        >
          Return to Terminal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-[#1800AC] selection:text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#1800AC] transition-all mb-10 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Bookings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Lead Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-12 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#1800AC] font-bold mb-3 block">
                    Inquiry Profile
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {booking.customerName}
                  </h1>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    booking.status === "PENDING"
                      ? "border-orange-100 text-orange-600 bg-orange-50/50"
                      : "border-emerald-100 text-emerald-600 bg-emerald-50/50"
                  }`}
                >
                  {booking.status === "PENDING"
                    ? "● Pending Review"
                    : "● Processed"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Email Address
                  </span>
                  <div className="text-sm font-semibold flex items-center gap-2.5 text-slate-700">
                    <div className="w-8 h-8 rounded-[5px] bg-blue-50 flex items-center justify-center text-[#1800AC]">
                      <Mail size={14} />
                    </div>
                    {booking.customerEmail}
                  </div>
                </div>
                {booking.customerPhone && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                      Contact Number
                    </span>
                    <div className="text-sm font-semibold flex items-center gap-2.5 text-slate-700">
                      <div className="w-8 h-8 rounded-[5px] bg-blue-50 flex items-center justify-center text-[#1800AC]">
                        <MessageSquare size={14} />
                      </div>
                      {booking.customerPhone}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Inquiry Type
                  </span>
                  <div className="text-sm font-semibold flex items-center gap-2.5 text-slate-700">
                    <div className="w-8 h-8 rounded-[5px] bg-blue-50 flex items-center justify-center text-[#1800AC]">
                      <ShieldCheck size={14} />
                    </div>
                    {booking.serviceType}
                  </div>
                </div>
              </div>

              {/* Assessment Protocol Data */}
              <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 mb-12">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#1800AC] font-bold mb-8 block">
                  Asset Assessment Data
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                        Property Type
                      </span>
                      <p className="text-sm font-bold text-slate-700">
                        {booking.propertyType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                        Location
                      </span>
                      <p className="text-sm font-bold text-slate-700">
                        {booking.propertyLocation || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                        Units/Rooms
                      </span>
                      <p className="text-sm font-bold text-slate-700">
                        {booking.unitsRooms || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                        Occupancy
                      </span>
                      <p className="text-sm font-bold text-slate-700">
                        {booking.occupancyStatus || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                        Monthly Income
                      </span>
                      <p className="text-sm font-bold text-[#1800AC]">
                        {booking.estimatedIncome || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                        Main Challenge
                      </span>
                      <p className="text-sm font-bold text-slate-700 bg-white px-3 py-1.5 rounded border border-slate-200 inline-block">
                        {booking.mainChallenge || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                        Main Goal
                      </span>
                      <p className="text-sm font-bold text-slate-700 bg-white px-3 py-1.5 rounded border border-slate-200 inline-block">
                        {booking.mainGoal || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-10 border-t border-slate-50">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Additional Narrative
                </span>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1800AC] rounded-full" />
                  <p className="text-base text-slate-600 leading-relaxed italic bg-slate-50/50 p-8 pl-10 rounded-r-xl border-l-0 border border-slate-100">
                    "
                    {booking.additionalInfo ||
                      booking.description ||
                      "No additional context provided by lead."}
                    "
                  </p>
                </div>
              </div>

              {linkedProperty && (
                <div className="mt-12 pt-12 border-t border-slate-50">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#1800AC] font-bold mb-6 block">
                    Linked Portfolio Asset
                  </span>
                  <div className="flex flex-col sm:flex-row gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="w-full sm:w-32 h-32 relative flex-shrink-0 overflow-hidden rounded-[5px]">
                      <img
                        src={linkedProperty.images[0] || ""}
                        alt={linkedProperty.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-base font-bold text-slate-900 mb-1">
                        {linkedProperty.title}
                      </h4>
                      <p className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <LinkIcon size={12} className="text-slate-400" />{" "}
                        {linkedProperty.location}
                      </p>
                      <div className="mt-4 flex gap-3">
                        <span className="text-[10px] font-bold text-[#1800AC] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                          {linkedProperty.bedrooms} Bedrooms
                        </span>
                        <span className="text-[10px] font-bold text-[#1800AC] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                          {linkedProperty.bathrooms} Bathrooms
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
            <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-10 shadow-sm sticky top-24">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#1800AC] font-bold mb-8 block text-center">
                Reply Protocol
              </span>

              {isSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                    <CheckCircle size={28} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mb-2">
                    Action Completed
                  </h2>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                    Redirecting to Terminal...
                  </p>
                </div>
              ) : booking.status !== "PENDING" ? (
                <div className="py-8 text-center space-y-6">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      booking.status === "CANCELLED"
                        ? "bg-red-50 text-red-500"
                        : "bg-emerald-50 text-emerald-500"
                    }`}
                  >
                    {booking.status === "CANCELLED" ? (
                      <ArrowLeft size={28} />
                    ) : (
                      <CheckCircle size={28} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                      {booking.status === "CANCELLED"
                        ? "Booking Declined"
                        : "Booking Confirmed"}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">
                      Protocol Finalized
                    </p>
                  </div>
                  {booking.meetingLink && (
                    <div className="p-4 bg-slate-50 rounded-[5px] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        Active Meeting Link
                      </p>
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        className="text-xs font-bold text-[#1800AC] break-all hover:underline"
                      >
                        {booking.meetingLink}
                      </a>
                    </div>
                  )}
                  <Link
                    href="/dashboard"
                    className="inline-block text-[10px] font-black text-[#1800AC] uppercase tracking-[0.2em] border-b-2 border-[#1800AC] pb-1"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      replyToBooking(booking.id, {
                        scheduledDate,
                        meetingLink,
                        message,
                      });
                    }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
                        <Calendar size={14} className="text-[#1800AC]" />{" "}
                        Requested Session
                      </label>

                      {booking.slot ? (
                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-[5px]">
                          <div className="text-sm font-bold text-slate-900 mb-1">
                            {new Date(
                              booking.slot.startTime,
                            ).toLocaleDateString('en-US', {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              timeZone: booking.timezone
                            })}
                          </div>
                          <div className="text-xs font-black text-[#1800AC] uppercase tracking-widest">
                            {new Date(
                              booking.slot.startTime,
                            ).toLocaleTimeString('en-US', {
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: booking.timezone
                            })}{" "}
                            ({booking.timezone})
                          </div>
                        </div>
                      ) : (
                        <input
                          required
                          type="datetime-local"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-[5px] text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1800AC] transition-all"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
                        <LinkIcon size={14} className="text-[#1800AC]" />{" "}
                        Virtual Meeting Link
                      </label>
                      <input
                        required
                        type="url"
                        placeholder="https://meet.google.com/..."
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1800AC] transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2 px-1">
                        <MessageSquare size={14} className="text-[#1800AC]" />{" "}
                        Message to Client
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Enter personalized message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1800AC] transition-all resize-none placeholder:text-slate-400"
                      />
                    </div>

                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="group w-full bg-[#1800AC] text-white py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-[5px] hover:bg-blue-800 active:scale-[0.98] transition-all disabled:bg-slate-300 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        "Processing..."
                      ) : (
                        <>
                          Approve & Send Invitation <Send size={15} />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="pt-6 border-t border-slate-100">
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to decline this booking? The slot will be re-opened for others.",
                          )
                        ) {
                          declineBooking(booking.id);
                        }
                      }}
                      disabled={isSubmitting}
                      className="w-full bg-white border-2 border-red-100 text-red-500 py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-[5px] hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} /> Decline & Re-open Slot
                    </button>
                    <p className="text-center text-[9px] text-slate-400 mt-4 uppercase tracking-widest leading-relaxed">
                      Declining will notify the client and automatically release
                      their selected time slot.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
