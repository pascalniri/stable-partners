import React from "react";
import { format, startOfToday, isSameDay, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Globe, Calendar as CalendarIcon } from "lucide-react";

interface BookingCalendarProps {
  availableDates: Date[]; // list of dates with open slots
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  timezone: string;
  onChangeTimezone: (timezone: string) => void;
}

const TIMEZONES = [
  "UTC",
  "Africa/Kigali",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Europe/Zurich",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
];

export default function BookingCalendar({
  availableDates,
  selectedDate,
  onSelectDate,
  timezone,
  onChangeTimezone,
}: BookingCalendarProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-[5px] border border-slate-200 shadow-sm flex flex-col items-center">
      <style>{`
        .booking-picker .rdp {
          --rdp-accent-color: #1800AC;
          --rdp-background-color: #EFF6FF;
          margin: 0;
        }
        .booking-picker .rdp-day_selected {
          background-color: var(--rdp-accent-color) !important;
          color: white !important;
          font-weight: bold;
          border-radius: 8px;
        }
        .booking-picker .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: var(--rdp-background-color);
          border-radius: 8px;
        }
        .booking-picker .rdp-day_today {
          font-weight: bold;
          color: #1800AC;
        }
      `}</style>

      <div className="w-full flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-50 text-[#1800AC] rounded-[5px] flex items-center justify-center">
          <CalendarIcon size={16} />
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Step 1</span>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Date</h3>
        </div>
      </div>

      <div className="booking-picker w-full flex justify-center border border-slate-100 p-4 rounded-[5px] bg-slate-50/50">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={(date) => {
            const today = startOfToday();
            if (date < today) return true;
            // Disable if not in availableDates array
            return !availableDates.some((d) => isSameDay(d, date));
          }}
          className="mx-auto"
        />
      </div>

      <div className="w-full mt-6 space-y-2 border-t border-slate-100 pt-6">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-0.5">
          <Globe size={12} className="text-[#1800AC]" /> Select Timezone
        </label>
        <select
          value={timezone}
          onChange={(e) => onChangeTimezone(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[5px] text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all cursor-pointer appearance-none"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
          {!TIMEZONES.includes(timezone) && (
            <option value={timezone}>{timezone}</option>
          )}
        </select>
      </div>
    </div>
  );
}
