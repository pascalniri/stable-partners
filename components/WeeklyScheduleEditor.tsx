import React, { useState, useEffect } from "react";
import { Clock, Globe, Save, Check } from "lucide-react";

export interface TemplateDay {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  isActive: boolean;
  startTime: string;
  endTime: string;
}

interface WeeklyScheduleEditorProps {
  initialTemplates: any[];
  onSave: (data: { templates: any[] }) => Promise<void>;
  isSaving: boolean;
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
];

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Denver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
];

// Generate times from 00:00 to 23:45 in 15-min increments
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  const hh = String(h).padStart(2, "0");
  TIME_OPTIONS.push(`${hh}:00`, `${hh}:15`, `${hh}:30`, `${hh}:45`);
}

export default function WeeklyScheduleEditor({
  initialTemplates,
  onSave,
  isSaving,
}: WeeklyScheduleEditorProps) {
  const [days, setDays] = useState<TemplateDay[]>(
    DAYS_OF_WEEK.map((d) => ({
      dayOfWeek: d.value,
      isActive: false,
      startTime: "09:00",
      endTime: "17:00",
    }))
  );

  const [timezone, setTimezone] = useState("UTC");
  const [duration, setDuration] = useState(30);
  const [buffer, setBuffer] = useState(10);
  const [tzSearch, setTzSearch] = useState("");

  // Sync initial templates from database
  useEffect(() => {
    if (initialTemplates && initialTemplates.length > 0) {
      // Set overall settings from first template item
      const first = initialTemplates[0];
      if (first.timezone) setTimezone(first.timezone);
      if (first.duration !== undefined && first.duration !== null) setDuration(Number(first.duration));
      if (first.buffer !== undefined && first.buffer !== null) setBuffer(Number(first.buffer));

      // Map day states
      setDays((prev) =>
        prev.map((d) => {
          const match = initialTemplates.find((t) => t.dayOfWeek === d.dayOfWeek);
          if (match) {
            return {
              dayOfWeek: d.dayOfWeek,
              isActive: true,
              startTime: match.startTime,
              endTime: match.endTime,
            };
          }
          return { ...d, isActive: false };
        })
      );
    } else {
      // Auto detect user timezone on mount if no template exists
      try {
        const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (localTz) setTimezone(localTz);
      } catch (e) {}
    }
  }, [initialTemplates]);

  const handleToggleDay = (dayOfWeek: number) => {
    setDays((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, isActive: !d.isActive } : d))
    );
  };

  const handleTimeChange = (dayOfWeek: number, field: "startTime" | "endTime", value: string) => {
    setDays((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d))
    );
  };

  const handleSave = async () => {
    const activeDays = days.filter((d) => d.isActive);
    const templatesData = activeDays.map((d) => ({
      dayOfWeek: d.dayOfWeek,
      startTime: d.startTime,
      endTime: d.endTime,
      timezone,
      duration,
      buffer,
    }));

    await onSave({ templates: templatesData });
  };

  const filteredTimezones = TIMEZONES.filter((tz) =>
    tz.toLowerCase().includes(tzSearch.toLowerCase())
  );

  const displayTimezones = filteredTimezones.length > 0 ? filteredTimezones : TIMEZONES;

  return (
    <div className="bg-white rounded-[5px] border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-50 text-[#1800AC] rounded-[5px] flex items-center justify-center">
          <Clock size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold font-outfit text-slate-900">Weekly Availability Setup</h2>
          <p className="text-xs font-medium text-slate-500">Configure recurring weekly availability templates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-[5px] border border-slate-100">
        {/* Timezone picker */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Globe size={12} className="text-[#1800AC]" /> Timezone Settings
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search or Select Timezone..."
              value={tzSearch || timezone}
              onChange={(e) => {
                setTzSearch(e.target.value);
                setTimezone(e.target.value);
              }}
              onFocus={() => setTzSearch("")}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[5px] text-xs font-semibold focus:border-[#1800AC] outline-none transition-all"
            />
            {tzSearch !== "" && (
              <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-[5px] shadow-lg z-10 text-xs">
                {displayTimezones.map((tz) => (
                  <button
                    key={tz}
                    type="button"
                    onClick={() => {
                      setTimezone(tz);
                      setTzSearch("");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 font-semibold text-slate-700"
                  >
                    {tz}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Duration picker */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Session Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[5px] text-xs font-semibold focus:border-[#1800AC] outline-none transition-all cursor-pointer"
          >
            <option value="15">15 Minutes (Express)</option>
            <option value="30">30 Minutes (Standard)</option>
            <option value="45">45 Minutes (Short Consultation)</option>
            <option value="60">60 Minutes (Deep Dive)</option>
            <option value="90">90 Minutes (Audit)</option>
          </select>
        </div>

        {/* Buffer picker */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Buffer Between Sessions
          </label>
          <select
            value={buffer}
            onChange={(e) => setBuffer(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[5px] text-xs font-semibold focus:border-[#1800AC] outline-none transition-all cursor-pointer"
          >
            <option value="0">No Buffer (Back-to-back)</option>
            <option value="5">5 Minutes</option>
            <option value="10">10 Minutes</option>
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
          </select>
        </div>
      </div>

      {/* Grid Monday - Sunday */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
          Active Availability Grid
        </label>
        <div className="divide-y divide-slate-100 border-y border-slate-100">
          {DAYS_OF_WEEK.map((dayInfo) => {
            const dayState = days.find((d) => d.dayOfWeek === dayInfo.value) || {
              dayOfWeek: dayInfo.value,
              isActive: false,
              startTime: "09:00",
              endTime: "17:00",
            };

            return (
              <div
                key={dayInfo.value}
                className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  dayState.isActive ? "bg-indigo-50/10 px-4 -mx-4 rounded" : ""
                }`}
              >
                {/* Day Switcher Toggle */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleToggleDay(dayInfo.value)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                      dayState.isActive ? "bg-[#1800AC]" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 ${
                        dayState.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="font-bold text-sm text-slate-900 w-28">{dayInfo.label}</span>
                </div>

                {/* Time range selection */}
                {dayState.isActive ? (
                  <div className="flex items-center gap-3">
                    <select
                      value={dayState.startTime}
                      onChange={(e) =>
                        handleTimeChange(dayInfo.value, "startTime", e.target.value)
                      }
                      className="px-3 py-2 bg-white border border-slate-200 rounded-[5px] text-xs font-bold text-slate-700 outline-none focus:border-[#1800AC] transition-all cursor-pointer"
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-slate-400 font-bold">to</span>
                    <select
                      value={dayState.endTime}
                      onChange={(e) =>
                        handleTimeChange(dayInfo.value, "endTime", e.target.value)
                      }
                      className="px-3 py-2 bg-white border border-slate-200 rounded-[5px] text-xs font-bold text-slate-700 outline-none focus:border-[#1800AC] transition-all cursor-pointer"
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 italic">Unavailable today</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#1800AC] text-white px-8 py-3.5 rounded-[5px] font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center gap-2.5 shadow-md shadow-blue-500/10 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Saving Settings...
            </>
          ) : (
            <>
              <Save size={16} /> Save Weekly Template
            </>
          )}
        </button>
      </div>
    </div>
  );
}
