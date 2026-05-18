"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { DashboardNavbar } from "../../../components/layout/DashboardNavbar";
import WeeklyScheduleEditor from "../../../components/WeeklyScheduleEditor";
import DateOverridePanel from "../../../components/DateOverridePanel";
import PublishPanel from "../../../components/PublishPanel";
import { 
  Calendar as CalendarIcon, 
  Trash2, 
  Clock, 
  RefreshCcw, 
  Layers, 
  CheckCircle,
  XCircle,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";

interface SessionItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "OPEN" | "BOOKED" | "CANCELLED";
  booking?: {
    id: string;
    customerName: string;
    customerEmail: string;
    status: string;
  } | null;
}

export default function SessionsAdminPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"template" | "overrides" | "publish" | "sessions">("template");
  const [templates, setTemplates] = useState<any[]>([]);
  const [overrides, setOverrides] = useState<any[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "BOOKED" | "CANCELLED">("ALL");

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await fetch("/api/admin/availability?format=template", {
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
        setOverrides(data.overrides || []);
      } else {
        toast.error("Failed to load availability configuration.");
      }
    } catch (err) {
      toast.error("Error connecting to server.");
    } finally {
      setLoadingConfig(false);
    }
  };

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch("/api/admin/sessions", {
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data || []);
      } else {
        toast.error("Failed to retrieve published sessions.");
      }
    } catch (err) {
      toast.error("Error loading sessions.");
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchConfig();
      fetchSessions();
    }
  }, [isAuthenticated]);

  const handleSaveTemplates = async (data: { templates: any[] }) => {
    setIsSaving(true);
    const toastId = toast.loading("Saving weekly recurring schedule...");
    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setTemplates(updated.templates || []);
        toast.success("Weekly availability template updated successfully!", { id: toastId });
      } else {
        const err = await res.json();
        toast.error(err.error || "Save failed.", { id: toastId });
      }
    } catch (err) {
      toast.error("Connection error.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveOverride = async (overrideData: any) => {
    setIsSaving(true);
    const toastId = toast.loading("Saving date override...");
    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ overrides: [overrideData] }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOverrides(updated.overrides || []);
        toast.success("Override date scheduled successfully!", { id: toastId });
      } else {
        const err = await res.json();
        toast.error(err.error || "Override save failed.", { id: toastId });
      }
    } catch (err) {
      toast.error("Connection error.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOverride = async (overrideId: string) => {
    const toastId = toast.loading("Removing date override...");
    try {
      const res = await fetch(`/api/admin/overrides/${overrideId}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (res.ok) {
        toast.success("Override date cleared.", { id: toastId });
        fetchConfig();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete override.", { id: toastId });
      }
    } catch (err) {
      toast.error("Connection error.", { id: toastId });
    }
  };

  const handlePublishRange = async (rangeData: { startDate: string; endDate: string }) => {
    setIsSaving(true);
    const toastId = toast.loading("Publishing session slots to production...");
    try {
      const res = await fetch("/api/admin/sessions/publish", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(rangeData),
      });

      if (res.ok) {
        const result = await res.json();
        toast.success(result.message || "Sessions published!", { id: toastId });
        fetchSessions();
        setActiveTab("sessions"); // switch to list view
      } else {
        const err = await res.json();
        toast.error(err.error || "Publish failed.", { id: toastId });
      }
    } catch (err) {
      toast.error("Connection error.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this open session slot?")) return;
    const toastId = toast.loading("Deleting session slot...");
    try {
      const res = await fetch(`/api/admin/sessions/${sessionId}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (res.ok) {
        toast.success("Session slot deleted successfully.", { id: toastId });
        fetchSessions();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete session.", { id: toastId });
      }
    } catch (err) {
      toast.error("Connection error.", { id: toastId });
    }
  };

  if (!isAuthenticated) return null;

  const filteredSessions = sessions.filter((s) => {
    if (statusFilter === "ALL") return true;
    return s.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans">
      <DashboardNavbar
        currentPath="/dashboard/sessions"
        onRefresh={() => {
          fetchConfig();
          fetchSessions();
        }}
        isLoading={loadingConfig || loadingSessions}
      />

      <main className="container mx-auto px-6 py-12 space-y-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-black font-outfit tracking-tight text-slate-900">
              Session Engine
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Configure templates, schedule holidays, and publish booking grids.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchConfig();
                fetchSessions();
              }}
              className="p-3 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-950 border border-slate-200 rounded-[5px] transition-all"
              title="Refresh Core Data"
            >
              <RefreshCcw size={16} className={loadingConfig || loadingSessions ? "animate-spin" : ""} />
            </button>
            <a
              href="/book/admin"
              target="_blank"
              className="px-5 py-3.5 bg-[#1800AC] hover:bg-blue-800 text-white rounded-[5px] font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-md shadow-blue-500/10 active:scale-95"
            >
              <ExternalLink size={14} /> Open Booking Page
            </a>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap border-b border-slate-200 gap-1.5">
          <button
            onClick={() => setActiveTab("template")}
            className={`px-6 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "template"
                ? "border-[#1800AC] text-[#1800AC]"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            Weekly Grid
          </button>
          <button
            onClick={() => setActiveTab("overrides")}
            className={`px-6 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "overrides"
                ? "border-[#1800AC] text-[#1800AC]"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            Date Overrides
          </button>
          <button
            onClick={() => setActiveTab("publish")}
            className={`px-6 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "publish"
                ? "border-[#1800AC] text-[#1800AC]"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            Publish Calendar
          </button>
          <button
            onClick={() => setActiveTab("sessions")}
            className={`px-6 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "sessions"
                ? "border-[#1800AC] text-[#1800AC]"
                : "border-transparent text-slate-400 hover:text-slate-900"
            }`}
          >
            Published Sessions
          </button>
        </div>

        {/* Dynamic Panel Content */}
        {loadingConfig && activeTab !== "sessions" ? (
          <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[5px] border border-slate-200">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-[#1800AC] rounded-full animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Synchronizing Settings Database...
            </span>
          </div>
        ) : (
          <div className="transition-all duration-300">
            {activeTab === "template" && (
              <WeeklyScheduleEditor
                initialTemplates={templates}
                onSave={handleSaveTemplates}
                isSaving={isSaving}
              />
            )}

            {activeTab === "overrides" && (
              <DateOverridePanel
                overrides={overrides}
                onSaveOverride={handleSaveOverride}
                onDeleteOverride={handleDeleteOverride}
                isSaving={isSaving}
              />
            )}

            {activeTab === "publish" && (
              <PublishPanel
                templates={templates}
                overrides={overrides}
                onPublish={handlePublishRange}
                isPublishing={isSaving}
              />
            )}

            {activeTab === "sessions" && (
              <div className="bg-white rounded-[5px] border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-[#1800AC] rounded-[5px] flex items-center justify-center">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-outfit text-slate-900 font-outfit">Active Published Slots</h2>
                      <p className="text-xs font-medium text-slate-500">View and manage live availability session slots.</p>
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex bg-slate-100 p-1 rounded-[5px] text-[10px] font-black uppercase tracking-wider">
                    {(["ALL", "OPEN", "BOOKED", "CANCELLED"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`px-4 py-2 rounded-[5px] transition-all ${
                          statusFilter === filter
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-700"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {loadingSessions ? (
                  <div className="h-64 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500/20 border-t-[#1800AC] rounded-full animate-spin mb-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Querying Live Calendar Records...
                    </span>
                  </div>
                ) : filteredSessions.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-[5px] border border-dashed border-slate-200">
                    <CalendarIcon size={44} className="text-slate-300 mb-3" />
                    <span className="text-sm font-bold text-slate-500">No sessions match query</span>
                    <span className="text-xs text-slate-400 mt-1 max-w-[220px]">
                      Head over to "Publish Calendar" to create slots for your chosen date range.
                    </span>
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-[5px] overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-6 py-3">Scheduled Date</th>
                          <th className="px-6 py-3">Timing Range</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Assigned Booking Details</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {filteredSessions.map((session) => {
                          const dateObj = new Date(session.date);
                          const start = new Date(session.startTime);
                          const end = new Date(session.endTime);
                          const booking = session.booking;

                          return (
                            <tr key={session.id} className="hover:bg-slate-50/30">
                              <td className="px-6 py-4 font-bold text-slate-900">
                                {dateObj.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </td>
                              <td className="px-6 py-4">
                                {start.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                                {" — "}
                                {end.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </td>
                              <td className="px-6 py-4">
                                {session.status === "OPEN" && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                    <Clock size={10} /> Active Open
                                  </span>
                                )}
                                {session.status === "BOOKED" && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                    <CheckCircle size={10} /> Reserved
                                  </span>
                                )}
                                {session.status === "CANCELLED" && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                    <XCircle size={10} /> Cancelled
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {booking ? (
                                  <div className="space-y-0.5">
                                    <div className="font-bold text-slate-900 text-xs">{booking.customerName}</div>
                                    <div className="text-[10px] text-slate-400">{booking.customerEmail}</div>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic font-medium">None</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {session.status === "OPEN" ? (
                                  <button
                                    onClick={() => handleDeleteSession(session.id)}
                                    className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-[5px] transition-all"
                                    title="Delete Session"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-300 italic">Locked</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
