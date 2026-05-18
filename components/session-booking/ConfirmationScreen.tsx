import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Check, Calendar as CalendarIcon, Download, Globe, AlertCircle, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

interface ConfirmationScreenProps {
  booking: {
    id: string;
    customerName: string;
    customerEmail: string;
    notes?: string;
    timezone: string;
    session?: {
      startTime: string | Date;
      endTime: string | Date;
    };
    slot?: {
      startTime: string | Date;
      endTime: string | Date;
    };
  };
}

export default function ConfirmationScreen({ booking }: ConfirmationScreenProps) {
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const getActiveTimes = () => {
    if (booking.session) return booking.session;
    if (booking.slot) return booking.slot;
    return null;
  };

  const times = getActiveTimes();

  const formatDateTime = (timeInput: string | Date) => {
    const dateObj = typeof timeInput === "string" ? parseISO(timeInput) : timeInput;
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: booking.timezone,
    });
  };

  const generateCalendarInvite = () => {
    if (!times) return;
    const start = typeof times.startTime === "string" ? parseISO(times.startTime) : times.startTime;
    const end = typeof times.endTime === "string" ? parseISO(times.endTime) : times.endTime;

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PROID:-//Stable Partners//Session Booking System//EN",
      "BEGIN:VEVENT",
      `UID:${booking.id}`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(start)}`,
      `DTEND:${formatICSDate(end)}`,
      "SUMMARY:Stable Partners Consultation Session",
      `DESCRIPTION:Meeting notes: ${booking.notes || "No extra notes shared."}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `stable-partners-${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Calendar invite downloaded!");
  };

  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this scheduled booking? Both parties will be notified.")) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setCancelled(true);
        toast.success("Your booking has been successfully cancelled.");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to cancel booking.");
      }
    } catch (err) {
      toast.error("Network error cancelling booking.");
    } finally {
      setCancelling(false);
    }
  };

  if (cancelled) {
    return (
      <div className="bg-white p-8 rounded-[5px] border border-slate-200 shadow-sm max-w-xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-outfit text-slate-900">Booking Cancelled</h2>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            The session booking slot has been released back into availability. Confirmation emails have been dispatched.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#1800AC] text-white px-8 py-3.5 rounded-[5px] font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all shadow-md shadow-blue-500/10"
        >
          Book Another Session
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[5px] border border-slate-200 shadow-sm max-w-xl mx-auto space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-inner shadow-emerald-500/5">
          <Check size={32} />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-outfit text-slate-900 tracking-tight">Booking Confirmed!</h2>
          <p className="text-xs font-semibold text-slate-500">Your session is locked in and invitation invites are sent.</p>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-[5px] space-y-4 text-xs">
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Client Details</span>
            <span className="font-bold text-slate-900 text-sm">{booking.customerName}</span>
            <span className="text-slate-500 block">{booking.customerEmail}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#1800AC] bg-blue-50 px-2.5 py-1 rounded">
            INVITE SENT
          </span>
        </div>

        {times && (
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Date & Timing</span>
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CalendarIcon size={14} className="text-[#1800AC]" />
              <span>{formatDateTime(times.startTime)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium ml-5">
              <Globe size={11} className="text-slate-400" />
              <span>Timezone Context: {booking.timezone}</span>
            </div>
          </div>
        )}

        {booking.notes && (
          <div className="space-y-1 border-t border-slate-100 pt-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Meeting Notes</span>
            <p className="text-slate-600 font-medium italic leading-relaxed">"{booking.notes}"</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={generateCalendarInvite}
          className="flex-1 bg-[#1800AC] text-white py-3.5 rounded-[5px] font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center justify-center gap-2.5 shadow-md shadow-blue-500/10 active:scale-95"
        >
          <Download size={14} /> Add to Calendar (.ics)
        </button>

        <button
          disabled={cancelling}
          onClick={handleCancelBooking}
          className="bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 py-3.5 px-6 rounded-[5px] font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
        >
          {cancelling ? "Processing..." : "Cancel Appointment"}
        </button>
      </div>

      <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <HelpCircle size={12} />
        <span>Need modifications? Tap Cancel above or contact admin.</span>
      </div>
    </div>
  );
}
