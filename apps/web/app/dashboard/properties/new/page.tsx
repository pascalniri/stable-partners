"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../hooks/useAuth";
import { usePropertyForm } from "../../../../hooks/usePropertyForm";
import {
  ArrowLeft,
  Send,
  Home,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  AlignLeft,
  X,
  UploadCloud,
} from "lucide-react";

export default function NewPropertyPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    images,
    videoUrl,
    isSubmitting,
    handleFileChange,
    removeImage,
    removeVideo,
    formState: { errors },
  } = usePropertyForm({
    onSuccess: () => router.push("/dashboard/properties"),
  });

  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#0a0a0a] font-sans">
      <div className="container mx-auto px-8 py-12">
        {/* Navigation */}
        <Link
          href="/dashboard/properties"
          className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#737373] hover:text-[#0a0a0a] transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Property Portfolio
        </Link>

        <div className="max-w-4xl">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#6ABAE9] font-bold mb-4 block">
            New Listing
          </span>
          <h1 className="text-4xl font-light tracking-tighter uppercase mb-12 text-[#0a0a0a]">
            Add New Property
          </h1>

          <div className="bg-white border border-[#0a0a0a]/5 p-12 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                    <Home size={12} /> Property Title
                  </label>
                  <input
                    {...register("title")}
                    placeholder="e.g. Skyline Residence"
                    className={`w-full bg-slate-50 border ${errors.title ? "border-red-500" : "border-[#0a0a0a]/5"} p-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-[#6ABAE9] transition-colors`}
                  />
                  {errors.title && (
                    <p className="text-[10px] text-red-500 uppercase font-bold">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={12} /> Location
                  </label>
                  <input
                    {...register("location")}
                    placeholder="e.g. Zurich, Seefeld"
                    className={`w-full bg-slate-50 border ${errors.location ? "border-red-500" : "border-[#0a0a0a]/5"} p-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-[#6ABAE9] transition-colors`}
                  />
                  {errors.location && (
                    <p className="text-[10px] text-red-500 uppercase font-bold">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                  <AlignLeft size={12} /> Description
                </label>
                <textarea
                  {...register("description")}
                  rows={6}
                  placeholder="Describe the property's unique features..."
                  className={`w-full bg-slate-50 border ${errors.description ? "border-red-500" : "border-[#0a0a0a]/5"} p-4 text-xs font-medium outline-none focus:border-[#6ABAE9] transition-colors resize-none`}
                />
                {errors.description && (
                  <p className="text-[10px] text-red-500 uppercase font-bold">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                    <DollarSign size={12} /> Price ($)
                  </label>
                  <input
                    type="number"
                    {...register("price")}
                    placeholder="Optional"
                    className="w-full bg-slate-50 border border-[#0a0a0a]/5 p-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-[#6ABAE9] transition-colors"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    {...register("bedrooms")}
                    className="w-full bg-slate-50 border border-[#0a0a0a]/5 p-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-[#6ABAE9] transition-colors"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    {...register("bathrooms")}
                    className="w-full bg-slate-50 border border-[#0a0a0a]/5 p-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-[#6ABAE9] transition-colors"
                  />
                </div>
              </div>

              {/* Status and Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={12} /> Property Media
                  </label>

                  <div className="relative group">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full border-2 border-dashed border-[#0a0a0a]/10 p-8 flex flex-col items-center gap-3 group-hover:border-[#6ABAE9] group-hover:bg-slate-50 transition-all">
                      <UploadCloud
                        size={24}
                        className="text-[#a3a3a3] group-hover:text-[#6ABAE9] transition-colors"
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Upload Images or Video
                      </span>
                      <p className="text-[12px] text-[#a3a3a3] uppercase tracking-[0.2em]">
                        Select files from your device
                      </p>
                    </div>
                  </div>

                  {/* Media Gallery Preview */}
                  <div className="space-y-6 pt-4">
                    {images.length > 0 && (
                      <div className="grid grid-cols-4 gap-4">
                        {images.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square border border-[#0a0a0a]/5 bg-slate-50 group"
                          >
                            <img
                              src={url}
                              alt="Upload Preview"
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {videoUrl && (
                      <div className="relative aspect-video border border-[#0a0a0a]/5 bg-slate-50 overflow-hidden group">
                        <video
                          src={videoUrl}
                          controls
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                        />
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="absolute top-2 right-2 w-6 h-6 bg-black text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                        <div className="absolute top-2 left-2 bg-black px-2 py-1">
                          <span className="text-[12px] font-bold text-white uppercase tracking-widest">
                            Video Protocol
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-[9px] text-[#a3a3a3] uppercase tracking-widest">
                    Secure transmission enabled via Cloudinary CDN.
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-[#0a0a0a]/5">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-[#0a0a0a] text-white py-3 text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-slate-800 transition-colors disabled:bg-slate-400 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      Add Property <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
