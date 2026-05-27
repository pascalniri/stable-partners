"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  isSameDay,
  parseISO,
  isBefore,
  isAfter,
  startOfDay,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Clock, Globe, ChevronRight, ChevronLeft } from "lucide-react";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  localDate: string;
  localTime: string;
  localEndTime: string;
}

interface BookingCalendarProps {
  onSelect: (slotId: string, timezone: string) => void;
  selectedSlotId?: string;
}

const timezones = [
  "UTC",
  "Africa/Kigali",
  "Europe/London",
  "Europe/Zurich",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Singapore",
];

export default function BookingCalendar({
  onSelect,
  selectedSlotId,
}: BookingCalendarProps) {
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);
      try {
        const res = await fetch(`/api/availability?timezone=${encodeURIComponent(timezone)}`);
        const data = await res.json();
        setAvailableSlots(data);
      } catch (err) {
        console.error("Failed to fetch slots", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
  }, [timezone]);

  const availableDaysStrings = Array.from(
    new Set(availableSlots.map((s) => s.localDate))
  );

  const slotsForSelectedDay = availableSlots.filter((slot) => {
    if (!selectedDay) return false;
    const selectedDateStr = format(selectedDay, "yyyy-MM-dd");
    return slot.localDate === selectedDateStr;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-[5px] overflow-hidden border border-slate-100 shadow-sm">
      {/* Date Selection */}
      <div className="p-6 bg-slate-50/50 border-r border-slate-100">
        <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold uppercase tracking-wider text-xs">
          <Globe size={14} className="text-[#1800AC]" />
          <span>Select Date & Timezone</span>
        </div>

        <style>{`
          .rdp { --rdp-accent-color: #1800AC; --rdp-background-color: #EFF6FF; margin: 0; }
          .rdp-day_selected { background-color: var(--rdp-accent-color) !important; color: white !important; font-weight: bold; border-radius: 8px; }
          .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: var(--rdp-background-color); border-radius: 8px; }
        `}</style>

        <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={setSelectedDay}
          disabled={(date) => {
            const today = startOfDay(new Date());
            // Disable if strictly before today OR if not in availableDays
            if (isBefore(startOfDay(date), today)) return true;
            const dateStr = format(date, "yyyy-MM-dd");
            return !availableDaysStrings.includes(dateStr);
          }}
          className="mx-auto"
        />

        <div className="mt-6">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
            Your Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => {
              const newTz = e.target.value;
              setTimezone(newTz);
              if (selectedSlotId) {
                onSelect(selectedSlotId, newTz);
              }
            }}
            className="w-full bg-white border border-slate-200 rounded-[5px] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
            {!timezones.includes(timezone) && (
              <option value={timezone}>{timezone}</option>
            )}
          </select>
        </div>
      </div>

      {/* Time Selection */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-xs">
            <Clock size={14} className="text-[#1800AC]" />
            <span>Available Times</span>
          </div>
          {selectedDay && (
            <span className="text-xs font-medium text-slate-500">
              {format(selectedDay, "EEEE, MMMM do")}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-8 h-8 border-4 border-[#1800AC]/20 border-t-[#1800AC] rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Checking Availability...
            </span>
          </div>
        ) : slotsForSelectedDay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {slotsForSelectedDay.map((slot) => (
              <button
                key={slot.id}
                onClick={() => onSelect(slot.id, timezone)}
                className={`flex items-center justify-between px-4 py-3 rounded-[5px] border transition-all group ${
                  selectedSlotId === slot.id
                    ? "bg-[#1800AC] border-[#1800AC] text-white shadow-lg shadow-blue-500/20"
                    : "bg-white border-slate-200 text-slate-700 hover:border-[#1800AC] hover:bg-blue-50/50"
                }`}
              >
                <span className="font-bold text-sm">
                  {slot.localTime} - {slot.localEndTime}
                </span>
                <ChevronRight
                  size={14}
                  className={
                    selectedSlotId === slot.id
                      ? "text-white"
                      : "text-slate-300 group-hover:text-[#1800AC]"
                  }
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center p-8 bg-slate-50 rounded-[5px] border border-dashed border-slate-200">
            <Clock size={32} className="text-slate-300 mb-4" />
            <p className="text-sm font-bold text-slate-500 mb-1">
              No slots available for this day
            </p>
            <p className="text-xs text-slate-400">
              Please select another date on the calendar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
