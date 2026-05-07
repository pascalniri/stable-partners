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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-[#1800AC] selection:text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Navigation */}
        <Link
          href="/dashboard/properties"
          className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#1800AC] transition-all mb-12 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Property Portfolio
        </Link>

        <div className="max-w-4xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#1800AC] font-bold mb-3 block">
            Protocol: Asset Registration
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mb-12">
            Add New Property
          </h1>

          <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-12 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Home size={14} className="text-[#1800AC]" /> Property Title
                  </label>
                  <input
                    {...register("title")}
                    placeholder="e.g. Skyline Residence"
                    className={`w-full bg-slate-50 border ${errors.title ? "border-red-500" : "border-slate-200"} px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1800AC] transition-all placeholder:text-slate-400`}
                  />
                  {errors.title && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} className="text-[#1800AC]" /> Location
                  </label>
                  <input
                    {...register("location")}
                    placeholder="e.g. Zurich, Seefeld"
                    className={`w-full bg-slate-50 border ${errors.location ? "border-red-500" : "border-slate-200"} px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1800AC] transition-all placeholder:text-slate-400`}
                  />
                  {errors.location && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <AlignLeft size={14} className="text-[#1800AC]" /> Description
                </label>
                <textarea
                  {...register("description")}
                  rows={6}
                  placeholder="Describe the property's unique features..."
                  className={`w-full bg-slate-50 border ${errors.description ? "border-red-500" : "border-slate-200"} px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1800AC] transition-all resize-none placeholder:text-slate-400`}
                />
                {errors.description && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign size={14} className="text-[#1800AC]" /> Price
                    ($)
                  </label>
                  <input
                    type="number"
                    {...register("price")}
                    placeholder="Optional"
                    className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1800AC] transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    {...register("bedrooms")}
                    className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1800AC] transition-all"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    {...register("bathrooms")}
                    className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1800AC] transition-all"
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={14} className="text-[#1800AC]" /> Property
                  Media
                </label>

                <div className="relative group">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center gap-4 group-hover:border-[#1800AC] group-hover:bg-blue-50/50 transition-all text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#1800AC] group-hover:bg-white group-hover:shadow-md transition-all">
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-900 block mb-1">
                        Upload Images or Video
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Drag and drop or click to select files
                      </p>
                    </div>
                  </div>
                </div>

                {/* Media Gallery Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square border border-slate-100 bg-slate-50 rounded-[5px] overflow-hidden group shadow-sm"
                    >
                      <img
                        src={url}
                        alt="Upload Preview"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 w-7 h-7 bg-white text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-md transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {videoUrl && (
                    <div className="relative col-span-2 aspect-video border border-slate-100 bg-slate-50 rounded-[5px] overflow-hidden group shadow-sm">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-3 right-3 w-8 h-8 bg-white text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-md transition-all z-20"
                      >
                        <X size={16} />
                      </button>
                      <div className="absolute top-3 left-3 bg-[#1800AC] px-2.5 py-1 rounded-full shadow-lg">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                          <Send size={10} /> Video Protocol
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                  Secure transmission enabled via Cloudinary CDN.
                </p>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-[#1800AC] text-white py-4 rounded-[5px] text-xs font-bold tracking-[0.4em] uppercase hover:bg-blue-700 transition-all active:scale-[0.99] disabled:bg-slate-300 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    "Processing Protocol..."
                  ) : (
                    <>
                      FINALIZE REGISTRATION <Send size={16} />
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
