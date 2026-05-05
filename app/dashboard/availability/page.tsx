"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  RefreshCcw, 
  ArrowLeft,
  Clock,
  CheckCircle
} from "lucide-react";
import { format, parseISO, startOfToday, addDays } from "date-fns";
import toast from "react-hot-toast";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  booking?: { id: string };
}

export default function AvailabilityPage() {
  const { isAuthenticated } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [rangeStart, setRangeStart] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  const [rangeEnd, setRangeEnd] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotDuration, setSlotDuration] = useState("60");
  const duration = Number(slotDuration) || 60;

  // Load from localStorage & detect latest slot on mount
  useEffect(() => {
    // 1. First load sticky defaults from localStorage
    const savedStartTime = localStorage.getItem("schedule_start_time");
    const savedEndTime = localStorage.getItem("schedule_end_time");
    const savedDuration = localStorage.getItem("schedule_duration");

    if (savedStartTime) setStartTime(savedStartTime);
    if (savedEndTime) setEndTime(savedEndTime);
    if (savedDuration) setSlotDuration(savedDuration);

    // 2. Then, detect where we left off based on existing slots
    if (slots.length > 0) {
      // Find the latest day
      const dates = slots.map(s => parseISO(s.startTime).getTime());
      const maxDate = new Date(Math.max(...dates));
      const dateKey = format(maxDate, "yyyy-MM-dd");
      
      setRangeStart(dateKey);
      setRangeEnd(dateKey);

      // Find the time window for that specific latest day
      const daySlots = slots.filter(s => format(parseISO(s.startTime), "yyyy-MM-dd") === dateKey);
      if (daySlots.length > 0) {
        const sortedDaySlots = [...daySlots].sort((a,b) => a.startTime.localeCompare(b.startTime));
        const firstSlot = sortedDaySlots[0];
        const lastSlot = sortedDaySlots[sortedDaySlots.length - 1];
        
        setStartTime(format(parseISO(firstSlot.startTime), "HH:mm"));
        setEndTime(format(parseISO(lastSlot.endTime), "HH:mm"));

        // Detect duration from the first slot
        const diff = (parseISO(firstSlot.endTime).getTime() - parseISO(firstSlot.startTime).getTime()) / (1000 * 60);
        setSlotDuration(String(diff));
      }
    }
  }, [slots.length]); // Re-run when slots are first loaded

  // Save sticky defaults to localStorage
  useEffect(() => {
    localStorage.setItem("schedule_start_time", startTime);
    localStorage.setItem("schedule_end_time", endTime);
    localStorage.setItem("schedule_duration", slotDuration);
  }, [startTime, endTime, slotDuration]);

  const loadSlotIntoForm = (slot: Slot) => {
    const date = format(parseISO(slot.startTime), "yyyy-MM-dd");
    const sTime = format(parseISO(slot.startTime), "HH:mm");
    const eTime = format(parseISO(slot.endTime), "HH:mm");
    
    setRangeStart(date);
    setRangeEnd(date);
    setStartTime(sTime);
    setEndTime(eTime);
    
    // Calculate duration in minutes
    const diff = (parseISO(slot.endTime).getTime() - parseISO(slot.startTime).getTime()) / (1000 * 60);
    setSlotDuration(String(diff));
    
    toast.success("Slot data loaded into form");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/availability");
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      toast.error("Failed to load availability.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchSlots();
  }, [isAuthenticated]);

  const generateSlots = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    const toastId = toast.loading("Generating schedule...");
    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          startDate: rangeStart, 
          endDate: rangeEnd, 
          startTime,
          endTime,
          slotDuration: slotDuration
        }),
      });
      if (res.ok) {
        toast.success("Schedule successfully generated!", { id: toastId });
        fetchSlots();
      } else {
        toast.error("Generation failed. Check your range.", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#1800AC] transition-all">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1800AC] rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="text-xs font-bold uppercase tracking-widest">Smart Scheduler</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left: Advanced Control Form */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-500/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 text-[#1800AC] rounded-xl flex items-center justify-center">
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-outfit">Schedule Protocol</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability Engine v2.0</p>
                </div>
              </div>
              
              <form onSubmit={generateSlots} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Date From</label>
                    <input 
                      type="date" 
                      value={rangeStart} 
                      onChange={e => setRangeStart(e.target.value)}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] outline-none font-bold text-xs transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Date To</label>
                    <input 
                      type="date" 
                      value={rangeEnd} 
                      onChange={e => setRangeEnd(e.target.value)}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] outline-none font-bold text-xs transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Daily Start</label>
                    <input 
                      type="time" 
                      value={startTime} 
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] outline-none font-bold text-xs transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Daily End</label>
                    <input 
                      type="time" 
                      value={endTime} 
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] outline-none font-bold text-xs transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Slot Duration</label>
                  <select 
                    value={slotDuration}
                    onChange={e => setSlotDuration(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] outline-none font-bold text-xs transition-all appearance-none cursor-pointer"
                  >
                    <option value="30">30 Minutes (Short Session)</option>
                    <option value="45">45 Minutes (Standard Session)</option>
                    <option value="60">60 Minutes (Deep Assessment)</option>
                    <option value="90">90 Minutes (Executive Strategy)</option>
                  </select>
                </div>

                <button 
                  disabled={isGenerating}
                  type="submit"
                  className="w-full bg-[#1800AC] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                >
                  {isGenerating ? "Processing Logic..." : <><Plus size={16} /> Batch Generate Slots</>}
                </button>
              </form>
            </div>

            <div className="bg-blue-900 text-white p-8 rounded-[2rem] shadow-xl">
              <Clock className="text-blue-300 mb-4" size={32} />
              <h3 className="text-lg font-bold mb-2 font-outfit">System Logic</h3>
              <p className="text-sm text-blue-100 leading-relaxed opacity-80">
                Generating slots will create {duration}-minute windows between your start and end times. Only unbooked slots are visible to users.
              </p>
            </div>
          </div>

          {/* Right: Slots List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-900">Active Availability Windows</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={async () => {
                    if (confirm("NUCLEAR OPTION: This will delete ALL future unbooked slots. Your bookings will remain safe. Proceed?")) {
                      const res = await fetch("/api/admin/availability/wipe", { method: "DELETE" });
                      if (res.ok) {
                        toast.success("Schedule wiped clean!");
                        fetchSlots();
                      } else {
                        toast.error("Wipe failed.");
                      }
                    }
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2 border border-red-100"
                >
                  <Trash2 size={14} /> Clear All
                </button>
                <button onClick={fetchSlots} className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-[#1800AC]">
                  <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Schedule...</span>
              </div>
            ) : slots.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-dashed border-slate-200 text-center p-8">
                <CalendarIcon size={48} className="text-slate-200 mb-4" />
                <p className="text-slate-500 font-bold">No active slots found</p>
                <p className="text-xs text-slate-400 mt-1">Use the form on the left to open your calendar.</p>
              </div>
            ) : (
              <div className="space-y-10 max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar">
                {Object.entries(
                  slots.reduce((acc, slot) => {
                    const dateKey = format(parseISO(slot.startTime), "yyyy-MM-dd");
                    if (!acc[dateKey]) acc[dateKey] = [];
                    acc[dateKey].push(slot);
                    return acc;
                  }, {} as Record<string, Slot[]>)
                ).sort().map(([dateKey, daySlots]) => (
                  <div key={dateKey} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-[1px] flex-1 bg-slate-100" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-4 py-1 rounded-full border border-slate-100">
                        {format(parseISO(dateKey), "EEEE, MMMM do")}
                      </span>
                      <div className="h-[1px] flex-1 bg-slate-100" />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {daySlots.sort((a,b) => a.startTime.localeCompare(b.startTime)).map(slot => {
                        const start = parseISO(slot.startTime);
                        const end = parseISO(slot.endTime);
                        const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

                        return (
                          <div key={slot.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-[#1800AC] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                            <div className="flex items-center gap-5">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                slot.isBooked ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-[#1800AC]"
                              }`}>
                                {slot.isBooked ? <CheckCircle size={20} /> : <Clock size={20} />}
                              </div>
                              
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="text-lg font-black text-slate-900 font-outfit tracking-tight">
                                    {format(start, "HH:mm")} — {format(end, "HH:mm")}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-tighter">
                                    {durationMinutes} min
                                  </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                  {slot.isBooked ? (
                                    <span className="text-orange-500 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                      Currently Reserved
                                    </span>
                                  ) : (
                                    <span className="text-emerald-500 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      Active & Open for Booking
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 self-end sm:self-center">
                              {!slot.isBooked && (
                                <>
                                  <button 
                                    onClick={() => loadSlotIntoForm(slot)}
                                    className="px-4 py-2 bg-slate-50 text-slate-400 hover:text-[#1800AC] hover:bg-blue-50 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                    title="Load this pattern into form"
                                  >
                                    <RefreshCcw size={12} />
                                    Reuse
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      if(confirm("Remove this availability?")) {
                                        const res = await fetch(`/api/admin/availability/${slot.id}`, { method: 'DELETE' });
                                        if(res.ok) {
                                          toast.success("Slot removed");
                                          fetchSlots();
                                        } else {
                                          const err = await res.json();
                                          toast.error(err.error || "Failed to remove slot");
                                        }
                                      }
                                    }}
                                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Delete slot"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                              {slot.isBooked && slot.booking?.id && (
                                <Link 
                                  href={`/dashboard/bookings/${slot.booking.id}`} 
                                  className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-100 transition-all border border-orange-100"
                                >
                                  View Booking
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
