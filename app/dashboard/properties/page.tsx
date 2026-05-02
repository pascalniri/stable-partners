"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useProperties, Property } from "../../../hooks/useProperties";
import { useAuth } from "../../../hooks/useAuth";
import {
  LogOut,
  RefreshCcw,
  Plus,
  MapPin,
  Building2,
  Trash2,
  Edit3,
  Image as ImageIcon,
} from "lucide-react";
import { EditPropertyDrawer } from "../../../components/drawers/EditPropertyDrawer";
import { useRouter } from "next/navigation";

export default function PropertiesDashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const { properties, isLoading, refresh, deleteProperty } = useProperties();
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated]);

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsDrawerOpen(true);
  };

  if (!isAuthenticated) return null;
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header Nav */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-10">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                Admin Dashboard
              </h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Stable Partners Group
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/dashboard"
              className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors pb-1"
            >
              Bookings
            </Link>
            <Link
              href="/dashboard/properties"
              className="text-xs font-bold uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1"
            >
              Managed Assets
            </Link>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <button
              onClick={() => refresh()}
              className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Refresh Portfolio"
            >
              <RefreshCcw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-16">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.4em] mb-3 block">
              Portfolio Overview
            </span>
            <h2 className="text-3xl font-bold text-slate-900">
              Managed Assets
            </h2>
          </div>
          <Link
            href="/dashboard/properties/new"
            className="group text-xs tracking-widest relative px-8 py-4 bg-blue-600 text-white rounded font-bold transition-all hover:bg-blue-700 active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} /> ADD NEW PROPERTY
          </Link>
        </div>

        {/* Assets List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 px-8 py-4 bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50">
            <div className="col-span-5">Property Details</div>
            <div className="col-span-2 text-right">Market Price</div>
            <div className="col-span-3 text-center">Current Status</div>
            <div className="col-span-2 text-right">Management</div>
          </div>

          <div className="divide-y divide-slate-50">
            {isLoading && properties.length === 0 ? (
              <div className="py-24 text-center text-sm font-medium text-slate-400">
                Synchronizing Portfolio...
              </div>
            ) : properties.length === 0 ? (
              <div className="py-24 text-center text-sm font-medium text-slate-400">
                No assets currently registered in the portfolio.
              </div>
            ) : (
              properties.map((asset) => (
                <div
                  key={asset.id}
                  className="grid grid-cols-12 items-center px-8 py-6 hover:bg-slate-50/30 transition-all group"
                >
                  {/* Thumbnail Stack & Title */}
                  <div className="col-span-5 flex items-center gap-6">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      {asset.images && asset.images.length > 0 ? (
                        <>
                          {asset.images
                            .slice(0, 3)
                            .reverse()
                            .map((url, i, arr) => {
                              const index = arr.length - 1 - i; // Original index in the slice
                              return (
                                <div
                                  key={i}
                                  className="absolute inset-0 border border-white bg-white rounded-lg transition-all duration-500 shadow-md"
                                  style={{
                                    transform: `translate(${index * 4}px, -${index * 4}px)`,
                                    zIndex: 10 - index,
                                  }}
                                >
                                  <img
                                    src={url}
                                    alt={`${asset.title} ${index}`}
                                    className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all duration-700"
                                  />
                                </div>
                              );
                            })}
                          {asset.images.length > 3 && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm z-20 shadow-sm">
                              +{asset.images.length - 3}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full border border-slate-100 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {asset.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                        <MapPin size={12} className="text-blue-500" /> {asset.location}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-bold text-slate-900">
                      {asset.price ? `$ ${asset.price.toLocaleString()}` : "—"}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-3 flex justify-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        asset.status === "AVAILABLE"
                          ? "border-emerald-100 text-emerald-600 bg-emerald-50/50"
                          : asset.status === "SOLD"
                            ? "border-red-100 text-red-600 bg-red-50/50"
                            : "border-slate-100 text-slate-400 bg-slate-50"
                      }`}
                    >
                      {asset.status === "AVAILABLE" ? "● Available" : asset.status === "SOLD" ? "● Sold" : asset.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end items-center gap-3">
                    {confirmingDeleteId === asset.id ? (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-1 duration-300">
                        <button
                          onClick={async () => {
                            await deleteProperty(asset.id);
                            setConfirmingDeleteId(null);
                          }}
                          className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-md hover:bg-red-600 hover:text-white transition-all"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmingDeleteId(null)}
                          className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase rounded-md hover:bg-slate-200 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(asset)}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Property"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmingDeleteId(asset.id)}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Property"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <EditPropertyDrawer
        property={editingProperty}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
