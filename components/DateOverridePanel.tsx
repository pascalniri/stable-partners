import React, { useState } from "react";
import { format, startOfToday, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar as CalendarIcon, Trash2, ShieldAlert, Plus, Check } from "lucide-react";

export interface OverrideItem {
  id?: string;
  date: string; // ISO string or YYYY-MM-DD
  isUnavailable: boolean;
  startTime: string | null;
  endTime: string | null;
}

interface DateOverridePanelProps {
  overrides: OverrideItem[];
  onSaveOverride: (override: { date: string; isUnavailable: boolean; startTime?: string; endTime?: string }) => Promise<void>;
  onDeleteOverride: (overrideId: string) => Promise<void>;
  isSaving: boolean;
}

// Generate times from 00:00 to 23:45 in 15-min increments
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  const hh = String(h).padStart(2, "0");
  TIME_OPTIONS.push(`${hh}:00`, `${hh}:15`, `${hh}:30`, `${hh}:45`);
}

export default function DateOverridePanel({
  overrides,
  onSaveOverride,
  onDeleteOverride,
  isSaving,
}: DateOverridePanelProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isUnavailable, setIsUnavailable] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const handleAddOverride = async () => {
    if (!selectedDate) return;
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    await onSaveOverride({
      date: formattedDate,
      isUnavailable,
      startTime: isUnavailable ? undefined : startTime,
      endTime: isUnavailable ? undefined : endTime,
    });
  };

  return (
    <div className="bg-white rounded-[5px] border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
      <style>{`
        .override-picker .rdp {
          --rdp-accent-color: #1800AC;
          --rdp-background-color: #EFF6FF;
          margin: 0;
        }
        .override-picker .rdp-day_selected {
          background-color: var(--rdp-accent-color) !important;
          color: white !important;
          font-weight: bold;
          border-radius: 8px;
        }
        .override-picker .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: var(--rdp-background-color);
          border-radius: 8px;
        }
      `}</style>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-[5px] flex items-center justify-center">
          <CalendarIcon size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold font-outfit text-slate-900">Date Overrides</h2>
          <p className="text-xs font-medium text-slate-500">Configure special non-recurring day-off or unique slot hours.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Creator Column */}
        <div className="space-y-6">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
            1. Select Override Date
          </label>
          <div className="override-picker border border-slate-100 p-4 rounded-[5px] bg-slate-50/50 flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < startOfToday()}
              className="mx-auto"
            />
          </div>

          {selectedDate && (
            <div className="border border-indigo-100/50 bg-indigo-50/10 p-6 rounded-[5px] space-y-5">
              <span className="text-xs font-bold text-[#1800AC] uppercase tracking-widest block">
                Adjust Schedule for: {format(selectedDate, "MMMM do, yyyy")}
              </span>

              {/* Toggle switch for block vs custom hours */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Mark as Unavailable / Holiday</span>
                <button
                  type="button"
                  onClick={() => setIsUnavailable(!isUnavailable)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                    isUnavailable ? "bg-rose-500" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 ${
                      isUnavailable ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {!isUnavailable && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Custom Start Time
                    </span>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-[5px] text-xs font-bold text-slate-700 outline-none focus:border-[#1800AC] transition-all cursor-pointer"
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Custom End Time
                    </span>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-[5px] text-xs font-bold text-slate-700 outline-none focus:border-[#1800AC] transition-all cursor-pointer"
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddOverride}
                disabled={isSaving}
                className={`w-full text-white py-3 rounded-[5px] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  isUnavailable ? "bg-rose-500 hover:bg-rose-600" : "bg-[#1800AC] hover:bg-blue-800"
                } disabled:opacity-50`}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus size={14} /> Add Date Override
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Existing Overrides List */}
        <div className="flex flex-col">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1 mb-3">
            2. Configured Overrides List
          </label>
          <div className="flex-1 border border-slate-100 rounded-[5px] overflow-hidden flex flex-col min-h-[300px]">
            {overrides.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                <ShieldAlert size={36} className="text-slate-300 mb-3" />
                <span className="text-sm font-bold text-slate-600">No Overrides Programmed</span>
                <span className="text-xs text-slate-400 mt-1 max-w-[200px]">
                  Recurring template values will govern all dates.
                </span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto custom-scrollbar">
                {overrides.map((override) => {
                  const oDate = new Date(override.date);
                  return (
                    <div
                      key={override.id || override.date}
                      className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-sm text-slate-900">
                          {oDate.toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          {override.isUnavailable ? (
                            <span className="text-[9px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                              Unavailable
                            </span>
                          ) : (
                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">
                              {override.startTime} — {override.endTime}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => override.id && onDeleteOverride(override.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-[5px] transition-all"
                        title="Delete Override"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
