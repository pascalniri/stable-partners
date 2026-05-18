import React, { useState, useEffect } from "react";
import { format, addDays, startOfToday, parseISO, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2, AlertTriangle, Sparkles, Send } from "lucide-react";

interface PublishPanelProps {
  templates: any[];
  overrides: any[];
  onPublish: (data: { startDate: string; endDate: string }) => Promise<void>;
  isPublishing: boolean;
}

export default function PublishPanel({
  templates,
  overrides,
  onPublish,
  isPublishing,
}: PublishPanelProps) {
  const [startDate, setStartDate] = useState(format(startOfToday(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(addDays(startOfToday(), 14), "yyyy-MM-dd"));
  const [previewSlots, setPreviewSlots] = useState<any[]>([]);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const setShortcut = (days: number) => {
    setStartDate(format(startOfToday(), "yyyy-MM-dd"));
    setEndDate(format(addDays(startOfToday(), days), "yyyy-MM-dd"));
  };

  // Generate preview of slots locally for instant UI response
  useEffect(() => {
    if (!templates || templates.length === 0) {
      setPreviewSlots([]);
      setPreviewError("No weekly availability templates defined. Configure weekly template first.");
      return;
    }
    setPreviewError(null);

    try {
      const start = new Date(startDate + "T00:00:00");
      const end = new Date(endDate + "T23:59:59");
      if (start > end) {
        setPreviewSlots([]);
        setPreviewError("Start date cannot be after end date.");
        return;
      }

      const generated: any[] = [];
      let currentPointer = new Date(start);

      // Loop days
      while (currentPointer <= end) {
        const currentDateStr = format(currentPointer, "yyyy-MM-dd");
        const dayOfWeek = currentPointer.getDay(); // 0-6

        // Check override
        const override = overrides.find((o) => {
          const oDate = typeof o.date === "string" ? parseISO(o.date) : new Date(o.date);
          return isSameDay(oDate, currentPointer);
        });

        if (override) {
          if (!override.isUnavailable && override.startTime && override.endTime) {
            // Process custom hours override
            generateDaySlots(
              currentDateStr,
              override.startTime,
              override.endTime,
              templates[0].duration,
              templates[0].buffer,
              generated
            );
          }
          // If isUnavailable === true, we simply skip this day (do not generate slots)
        } else {
          // Process standard template day
          const dayTemplate = templates.find((t) => t.dayOfWeek === dayOfWeek);
          if (dayTemplate) {
            generateDaySlots(
              currentDateStr,
              dayTemplate.startTime,
              dayTemplate.endTime,
              dayTemplate.duration,
              dayTemplate.buffer,
              generated
            );
          }
        }

        currentPointer = addDays(currentPointer, 1);
      }

      setPreviewSlots(generated);
    } catch (err: any) {
      console.error(err);
      setPreviewError("Failed to calculate preview: " + err.message);
    }
  }, [startDate, endDate, templates, overrides]);

  const generateDaySlots = (
    dateStr: string,
    startTimeStr: string,
    endTimeStr: string,
    durationMin: number,
    bufferMin: number,
    targetArray: any[]
  ) => {
    const [startH, startM] = startTimeStr.split(":").map(Number);
    const [endH, endM] = endTimeStr.split(":").map(Number);

    const baseDate = new Date(dateStr + "T00:00:00");
    let pointer = new Date(baseDate);
    pointer.setHours(startH, startM, 0, 0);

    const threshold = new Date(baseDate);
    threshold.setHours(endH, endM, 0, 0);

    while (pointer < threshold) {
      const slotEnd = new Date(pointer.getTime() + durationMin * 60000);
      if (slotEnd <= threshold) {
        targetArray.push({
          date: dateStr,
          startTime: format(pointer, "HH:mm"),
          endTime: format(slotEnd, "HH:mm"),
          duration: durationMin,
        });
      }
      pointer = new Date(slotEnd.getTime() + bufferMin * 60000);
    }
  };

  const handlePublish = async () => {
    if (previewSlots.length === 0) return;
    await onPublish({ startDate, endDate });
  };

  return (
    <div className="bg-white rounded-[5px] border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-[5px] flex items-center justify-center">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold font-outfit text-slate-900">Publish Session Calendar</h2>
          <p className="text-xs font-medium text-slate-500">Generate open bookable slots for a selected date window.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-slate-50 p-6 rounded-[5px] border border-slate-100">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
            Window Start
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[5px] text-xs font-semibold focus:border-[#1800AC] outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
            Window End
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[5px] text-xs font-semibold focus:border-[#1800AC] outline-none transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShortcut(14)}
            className="flex-1 bg-white border border-slate-200 text-slate-700 hover:border-[#1800AC] hover:text-[#1800AC] px-3 py-3 rounded-[5px] text-[10px] font-black uppercase tracking-wider transition-all"
          >
            14 Days
          </button>
          <button
            type="button"
            onClick={() => setShortcut(30)}
            className="flex-1 bg-white border border-slate-200 text-slate-700 hover:border-[#1800AC] hover:text-[#1800AC] px-3 py-3 rounded-[5px] text-[10px] font-black uppercase tracking-wider transition-all"
          >
            30 Days
          </button>
          <button
            type="button"
            onClick={() => setShortcut(60)}
            className="flex-1 bg-white border border-slate-200 text-slate-700 hover:border-[#1800AC] hover:text-[#1800AC] px-3 py-3 rounded-[5px] text-[10px] font-black uppercase tracking-wider transition-all"
          >
            60 Days
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
            Upcoming Bookable Slot Preview ({previewSlots.length} items computed)
          </label>
        </div>

        {previewError ? (
          <div className="p-5 border border-amber-100 bg-amber-50/50 rounded-[5px] flex items-center gap-3 text-amber-800 text-xs font-bold">
            <AlertTriangle size={18} />
            <span>{previewError}</span>
          </div>
        ) : previewSlots.length === 0 ? (
          <div className="h-48 border border-dashed border-slate-200 rounded-[5px] bg-slate-50/30 flex flex-col items-center justify-center text-center p-6">
            <CalendarIcon size={36} className="text-slate-300 mb-3" />
            <span className="text-xs font-bold text-slate-500">No slots matching recurring template in this range.</span>
          </div>
        ) : (
          <div className="border border-slate-100 rounded-[5px] overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-3">Slot Date</th>
                  <th className="px-6 py-3">Timing Range</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewSlots.map((slot, index) => (
                  <tr key={index} className="hover:bg-slate-50/30 font-semibold text-slate-700">
                    <td className="px-6 py-3">
                      {new Date(slot.date + "T00:00:00").toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3 text-slate-900 font-bold">
                      {slot.startTime} — {slot.endTime}
                    </td>
                    <td className="px-6 py-3">{slot.duration} Min</td>
                    <td className="px-6 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 size={10} /> Pending Live
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Publish Execution */}
      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          onClick={handlePublish}
          disabled={isPublishing || previewSlots.length === 0}
          className="bg-emerald-600 text-white px-8 py-3.5 rounded-[5px] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2.5 shadow-md shadow-emerald-500/10 active:scale-95 disabled:opacity-50"
        >
          {isPublishing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Publishing to Production...
            </>
          ) : (
            <>
              <Send size={16} /> Publish Availability Range
            </>
          )}
        </button>
      </div>
    </div>
  );
}
