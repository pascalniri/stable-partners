import React from "react";
import { format, parseISO } from "date-fns";
import { Clock, ChevronRight, Inbox } from "lucide-react";

interface SlotItem {
  id: string;
  startTime: string | Date;
  endTime: string | Date;
  status: "OPEN" | "BOOKED" | "CANCELLED";
}

interface TimeSlotPickerProps {
  slots: SlotItem[];
  selectedSlotId?: string;
  onSelectSlot: (slotId: string) => void;
  timezone: string;
}

export default function TimeSlotPicker({
  slots,
  selectedSlotId,
  onSelectSlot,
  timezone,
}: TimeSlotPickerProps) {
  const formatSlotTime = (timeInput: string | Date) => {
    const dateObj = typeof timeInput === "string" ? parseISO(timeInput) : timeInput;
    // Format to HH:mm in chosen timezone
    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timezone,
    });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[5px] border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="w-full flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-50 text-[#1800AC] rounded-[5px] flex items-center justify-center">
          <Clock size={16} />
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Step 2</span>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Time</h3>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {slots.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-[5px] border border-dashed border-slate-200 min-h-[250px]">
            <Inbox size={32} className="text-slate-300 mb-3" />
            <span className="text-xs font-bold text-slate-500">No Open Slots Available</span>
            <span className="text-[10px] text-slate-400 mt-1 max-w-[180px]">
              Select a highlighted day on the calendar to load time windows.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar">
            {slots
              .sort((a, b) => {
                const dateA = typeof a.startTime === "string" ? new Date(a.startTime) : a.startTime;
                const dateB = typeof b.startTime === "string" ? new Date(b.startTime) : b.startTime;
                return dateA.getTime() - dateB.getTime();
              })
              .map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const startTimeStr = formatSlotTime(slot.startTime);
                const endTimeStr = formatSlotTime(slot.endTime);

                return (
                  <button
                    key={slot.id}
                    onClick={() => onSelectSlot(slot.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-[5px] border transition-all text-left ${
                      isSelected
                        ? "bg-[#1800AC] border-[#1800AC] text-white shadow-lg shadow-blue-500/20"
                        : "bg-white border-slate-200 text-slate-700 hover:border-[#1800AC] hover:bg-blue-50/20"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-black text-sm tracking-tight">
                        {startTimeStr} — {endTimeStr}
                      </span>
                      <span
                        className={`text-[9px] font-bold mt-0.5 ${
                          isSelected ? "text-blue-200" : "text-slate-400"
                        }`}
                      >
                        Local timezone slot conversion
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      className={isSelected ? "text-white" : "text-slate-300"}
                    />
                  </button>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
