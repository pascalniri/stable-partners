import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { User, Mail, MessageSquare, ShieldCheck, ChevronLeft } from "lucide-react";

interface SlotItem {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
}

interface BookingConfirmCardProps {
  slot: SlotItem;
  timezone: string;
  onSubmitBooking: (data: { name: string; email: string; notes: string }) => Promise<void>;
  isSubmitting: boolean;
  onBack: () => void;
}

export default function BookingConfirmCard({
  slot,
  timezone,
  onSubmitBooking,
  isSubmitting,
  onBack,
}: BookingConfirmCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const formatSlotDateTime = (timeInput: string | Date) => {
    const dateObj = typeof timeInput === "string" ? parseISO(timeInput) : timeInput;
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) newErrors.name = "Your name is required.";
    if (!email.trim()) {
      newErrors.email = "Your email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmitBooking({ name, email, notes });
  };

  const startStr = formatSlotDateTime(slot.startTime);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[5px] border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          type="button"
          className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Step 3</span>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Confirm Details</h3>
        </div>
      </div>

      <div className="border border-indigo-100/50 bg-indigo-50/10 p-5 rounded-[5px] space-y-2">
        <span className="text-[10px] font-black text-[#1800AC] uppercase tracking-wider block">Selected Appointment Slot</span>
        <div className="font-bold text-sm text-slate-900 tracking-tight leading-tight">
          {startStr}
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Timezone Context: {timezone}
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-0.5">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User size={14} />
            </div>
            <input
              type="text"
              placeholder="e.g. Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                errors.name ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10" : "border-slate-200 focus:border-[#1800AC] focus:ring-blue-500/10"
              } rounded-[5px] text-xs font-semibold focus:ring-4 outline-none transition-all`}
            />
          </div>
          {errors.name && (
            <span className="text-[10px] font-bold text-rose-500 block ml-0.5">{errors.name}</span>
          )}
        </div>

        {/* Email input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-0.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail size={14} />
            </div>
            <input
              type="email"
              placeholder="e.g. jean@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                errors.email ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10" : "border-slate-200 focus:border-[#1800AC] focus:ring-blue-500/10"
              } rounded-[5px] text-xs font-semibold focus:ring-4 outline-none transition-all`}
            />
          </div>
          {errors.email && (
            <span className="text-[10px] font-bold text-rose-500 block ml-0.5">{errors.email}</span>
          )}
        </div>

        {/* Notes input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-0.5">
            Meeting Notes (Optional)
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-3.5 flex items-start pointer-events-none text-slate-400">
              <MessageSquare size={14} />
            </div>
            <textarea
              rows={3}
              placeholder="Detail your goals for this assessment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-[5px] text-xs font-semibold focus:border-[#1800AC] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1800AC] text-white py-3.5 rounded-[5px] font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-95 disabled:opacity-50 mt-6"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Securing Booking...
            </>
          ) : (
            <>
              <ShieldCheck size={16} /> Secure Booking & Send Invites
            </>
          )}
        </button>
      </form>
    </div>
  );
}
