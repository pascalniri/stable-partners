"use client";

import React from "react";
import { Drawer } from "vaul";
import {
  X,
  Home,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  AlignLeft,
  Send,
  UploadCloud,
} from "lucide-react";
import { Property } from "../../hooks/useProperties";
import { usePropertyForm } from "../../hooks/usePropertyForm";

interface EditPropertyDrawerProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditPropertyDrawer = ({
  property,
  isOpen,
  onClose,
}: EditPropertyDrawerProps) => {
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
  } = usePropertyForm({ property, onSuccess: onClose });

  return (
    <Drawer.Root open={isOpen} onClose={onClose} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" />
        <Drawer.Content className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-[#F8F8F8] z-[101] flex flex-col shadow-2xl border-l border-[#0a0a0a]/10 outline-none">
          <div className="flex items-center justify-between p-8 bg-white border-b border-[#0a0a0a]/5">
            <div>
              <span className="text-[10px] font-bold text-[#6ABAE9] uppercase tracking-[0.4em] mb-1 block">
                Property Management
              </span>
              <Drawer.Title className="text-xl font-bold uppercase tracking-tight">
                Edit Property Details
              </Drawer.Title>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-4">
                <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                  <Home size={12} /> Property Title
                </label>
                <input
                  {...register("title")}
                  className={`w-full bg-white border ${errors.title ? "border-red-500" : "border-[#0a0a0a]/5"} p-4 text-[11px] font-semibold outline-none focus:border-[#6ABAE9] transition-colors shadow-sm`}
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
                  className={`w-full bg-white border ${errors.location ? "border-red-500" : "border-[#0a0a0a]/5"} p-4 text-[11px] font-semibold outline-none focus:border-[#6ABAE9] transition-colors shadow-sm`}
                />
                {errors.location && (
                  <p className="text-[10px] text-red-500 uppercase font-bold">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                  <AlignLeft size={12} /> Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className={`w-full bg-white border ${errors.description ? "border-red-500" : "border-[#0a0a0a]/5"} p-4 text-xs font-medium outline-none focus:border-[#6ABAE9] transition-colors resize-none shadow-sm`}
                />
                {errors.description && (
                  <p className="text-[10px] text-red-500 uppercase font-bold">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest flex items-center gap-2">
                    <DollarSign size={12} /> Price ($)
                  </label>
                  <input
                    type="number"
                    {...register("price")}
                    className="w-full bg-white border border-[#0a0a0a]/5 p-4 text-[11px] font-semibold outline-none focus:border-[#6ABAE9] transition-colors shadow-sm"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    {...register("bedrooms")}
                    className="w-full bg-white border border-[#0a0a0a]/5 p-4 text-[11px] font-semibold outline-none focus:border-[#6ABAE9] transition-colors shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    {...register("bathrooms")}
                    className="w-full bg-white border border-[#0a0a0a]/5 p-4 text-[11px] font-semibold outline-none focus:border-[#6ABAE9] transition-colors shadow-sm"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest">
                    Operational Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full bg-white border border-[#0a0a0a]/5 p-4 text-[11px] font-semibold outline-none focus:border-[#6ABAE9] transition-colors shadow-sm appearance-none"
                  >
                    <option value="MANAGED">MANAGED</option>
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="SOLD">SOLD</option>
                    <option value="UNDER_RENOVATION">RENOVATION</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-[#0a0a0a]/5">
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
                  <div className="w-full border-2 border-dashed border-[#0a0a0a]/10 p-8 flex flex-col items-center gap-3 group-hover:border-[#6ABAE9] group-hover:bg-white transition-all">
                    <UploadCloud
                      size={24}
                      className="text-[#a3a3a3] group-hover:text-[#6ABAE9] transition-colors"
                    />
                    <span className="text-[10px] font-semibold text-[#0a0a0a]">
                      Upload Images or Video
                    </span>
                    <p className="text-[12px] text-[#a3a3a3] uppercase tracking-[0.2em]">
                      Select files from your device
                    </p>
                  </div>
                </div>

                {/* Media Previews */}
                <div className="space-y-8">
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {images.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square border border-[#0a0a0a]/5 bg-white group overflow-hidden"
                        >
                          <img
                            src={url}
                            alt="Preview"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-black text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {videoUrl && (
                    <div className="relative aspect-video border border-[#0a0a0a]/5 bg-white overflow-hidden group">
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
              </div>

              <div className="pt-12">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-[#0a0a0a] text-white py-3 text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-slate-800 transition-all disabled:bg-slate-400 flex items-center justify-center gap-3 shadow-lg"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      Save Changes <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
