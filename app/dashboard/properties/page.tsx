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
    <div className="min-h-screen bg-[#F8F8F8] text-[#0a0a0a] font-sans selection:bg-[#6ABAE9] selection:text-white">
      {/* Sidebar / Header Nav */}
      <header className="bg-white border-b border-[#0a0a0a]/5 sticky top-0 z-50">
        <div className="container mx-auto px-8 h-20 flex items-center justify-between">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-4 cursor-pointer"
          >
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <div>
              <h1 className="text-[11px] font-bold uppercase tracking-[0.4em]">
                Admin Dashboard
              </h1>
              <p className="text-[10px] text-[#737373] uppercase tracking-[0.2em] mt-1">
                Stable Partners Group
              </p>
            </div>
          </div>

          <div className="flex items-center gap-12 ml-20">
            <Link
              href="/dashboard"
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors pb-1"
            >
              Bookings
            </Link>
            <Link
              href="/dashboard/properties"
              className="text-[10px] font-bold uppercase tracking-[0.3em] border-b-2 border-black pb-1"
            >
              Managed Assets
            </Link>
          </div>

          <div className="flex items-center gap-8 ml-auto">
            <button
              onClick={() => refresh()}
              className="p-2 text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors"
              title="Refresh Portfolio"
            >
              <RefreshCcw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-12">
        {/* Header Actions */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-[10px] font-bold text-[#6ABAE9] uppercase tracking-[0.4em] mb-4 block">
              Portfolio Overview
            </span>
            <h2 className="text-4xl font-light tracking-tighter uppercase">
              Managed Assets
            </h2>
          </div>
          <Link
            href="/dashboard/properties/new"
            className="bg-[#0a0a0a] text-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-[#262626] transition-colors"
          >
            <Plus size={16} /> Add a Property
          </Link>
        </div>

        {/* Assets List */}
        <div className="space-y-4">
          <div className="grid grid-cols-12 px-8 py-4 bg-white border border-[#0a0a0a]/5 text-[9px] font-bold uppercase tracking-widest text-[#a3a3a3]">
            <div className="col-span-5">Property Details</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-3 text-center">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {isLoading && properties.length === 0 ? (
            <div className="py-20 text-center text-[11px] uppercase tracking-widest text-[#a3a3a3] bg-white border border-[#0a0a0a]/5">
              Synchronizing Portfolio...
            </div>
          ) : properties.length === 0 ? (
            <div className="py-20 text-center text-[11px] uppercase tracking-widest text-[#a3a3a3] bg-white border border-[#0a0a0a]/5">
              No assets currently registered.
            </div>
          ) : (
            properties.map((asset) => (
              <div
                key={asset.id}
                className="grid grid-cols-12 items-center bg-white border border-[#0a0a0a]/5 p-4 hover:border-[#6ABAE9]/30 transition-all group"
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
                                className="absolute inset-0 border border-white/40 bg-white transition-all duration-500 shadow-sm"
                                style={{
                                  transform: `translate(${index * 3}px, -${index * 3}px)`,
                                  zIndex: 10 - index,
                                }}
                              >
                                <img
                                  src={url}
                                  alt={`${asset.title} ${index}`}
                                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                              </div>
                            );
                          })}
                        {asset.images.length > 3 && (
                          <div className="absolute -bottom-1 -right-1 bg-black text-white text-[7px] font-bold px-1 z-20">
                            +{asset.images.length - 3}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full border border-[#0a0a0a]/5 bg-slate-50 flex items-center justify-center text-[#d4d4d4]">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-tight mb-1 text-[#0a0a0a] line-clamp-1">
                      {asset.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9px] text-[#737373] uppercase tracking-wider font-medium">
                      <MapPin size={10} /> {asset.location}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-right">
                  <span className="text-[11px] font-medium tracking-tight">
                    {asset.price ? `$ ${asset.price.toLocaleString()}` : "N/A"}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-3 flex justify-center">
                  <span
                    className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest border ${
                      asset.status === "AVAILABLE"
                        ? "border-green-500/20 text-green-500 bg-green-50"
                        : asset.status === "SOLD"
                          ? "border-red-500/20 text-red-600 bg-red-50"
                          : "border-[#0a0a0a]/10 text-[#737373] bg-[#f8f8f8]"
                    }`}
                  >
                    {asset.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end items-center gap-4">
                  {confirmingDeleteId === asset.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-1 duration-300">
                      <button
                        onClick={async () => {
                          await deleteProperty(asset.id);
                          setConfirmingDeleteId(null);
                        }}
                        className="text-red-600 text-[12px] font-bold uppercase hover:underline"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmingDeleteId(null)}
                        className="text-[#a3a3a3] text-[12px] font-bold uppercase hover:text-[#0a0a0a]"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(asset)}
                        className="p-2 text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmingDeleteId(asset.id)}
                        className="p-2 text-[#a3a3a3] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
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
