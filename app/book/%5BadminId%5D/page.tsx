"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BookingCalendar from "../../../components/session-booking/BookingCalendar";
import TimeSlotPicker from "../../../components/session-booking/TimeSlotPicker";
import BookingConfirmCard from "../../../components/session-booking/BookingConfirmCard";
import ConfirmationScreen from "../../../components/session-booking/ConfirmationScreen";
import { format, isSameDay, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { Calendar as CalendarIcon } from "lucide-react";

export default function PublicBookingPage() {
  const params = useParams();
  const adminId = params?.adminId as string;

  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timezone, setTimezone] = useState("UTC");

  // Flow State
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(undefined);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // Step 1: select datetime, Step 2: enter details

  // Auto-detect client timezone on mount
  useEffect(() => {
    try {
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (localTz) setTimezone(localTz);
    } catch (e) {}
  }, []);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions?timezone=${encodeURIComponent(timezone)}`);
      if (res.ok) {
        const data = await res.json();
        setAvailableSlots(data || []);
      } else {
        toast.error("Failed to load available sessions.");
      }
    } catch (err) {
      toast.error("Error loading availability.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timezone) {
      fetchAvailableSlots();
    }
  }, [timezone]);

  // Compute available dates with at least 1 open slot
  const uniqueAvailableDates = Array.from(
    new Set(
      availableSlots
        .filter((s) => s.status === "OPEN")
        .map((s) => s.localDate)
    )
  ).map((dStr) => new Date(dStr + "T00:00:00"));

  // Slots for the selected date
  const slotsForSelectedDay = availableSlots.filter((slot) => {
    if (!selectedDate) return false;
    const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
    return slot.localDate === selectedDateStr && slot.status === "OPEN";
  });

  const selectedSlotObj = availableSlots.find((s) => s.id === selectedSlotId);

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
    setStep(2); // advance to Step 2 (form filling)
  };

  const handleConfirmBooking = async (formData: { name: string; email: string; notes: string }) => {
    if (!selectedSlotId) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Confirming session booking...");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSlotId,
          customerName: formData.name,
          customerEmail: formData.email,
          notes: formData.notes,
          timezone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfirmedBooking(data.booking);
        toast.success("Booking confirmed successfully!", { id: toastId });
      } else {
        const err = await res.json();
        toast.error(err.error || "Booking failed.", { id: toastId });
      }
    } catch (err) {
      toast.error("Network connection error.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-16 px-6 font-sans flex items-center justify-center">
        <div className="w-full max-w-xl">
          <ConfirmationScreen booking={confirmedBooking} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-6 font-sans flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white p-6 sm:p-8 rounded-[5px] border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 bg-blue-50 text-[#1800AC] rounded-full flex items-center justify-center border border-indigo-100">
              <CalendarIcon size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-outfit text-slate-900 leading-tight">
                Stable Partners Booking
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Book a strategy assessment with one of our professional advisors.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1800AC] bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded">
            Calendly Scheduler v2.0
          </span>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[5px] border border-slate-200">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-[#1800AC] rounded-full animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Syncing Open Calendar Options...
            </span>
          </div>
        ) : step === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-semibold">
            <BookingCalendar
              availableDates={uniqueAvailableDates}
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setSelectedSlotId(undefined);
              }}
              timezone={timezone}
              onChangeTimezone={setTimezone}
            />

            <TimeSlotPicker
              slots={slotsForSelectedDay}
              selectedSlotId={selectedSlotId}
              onSelectSlot={handleSelectSlot}
              timezone={timezone}
            />
          </div>
        ) : (
          selectedSlotObj && (
            <div className="max-w-xl mx-auto">
              <BookingConfirmCard
                slot={selectedSlotObj}
                timezone={timezone}
                onSubmitBooking={handleConfirmBooking}
                isSubmitting={isSubmitting}
                onBack={() => setStep(1)}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
