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
        <Drawer.Overlay className="fixed inset-0 bg-slate-900/40 z-[100] backdrop-blur-sm" />
        <Drawer.Content className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-white z-[101] flex flex-col shadow-2xl outline-none">
          <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.4em] mb-1.5 block">
                Management Protocol
              </span>
              <Drawer.Title className="text-xl font-bold text-slate-900">
                Edit Asset Details
              </Drawer.Title>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50/30">
            <div className="p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Home size={14} className="text-blue-600" /> Property Title
                  </label>
                  <input
                    {...register("title")}
                    className={`w-full bg-white border ${errors.title ? "border-red-500" : "border-slate-200"} px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-sm`}
                  />
                  {errors.title && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} className="text-blue-600" /> Location
                  </label>
                  <input
                    {...register("location")}
                    className={`w-full bg-white border ${errors.location ? "border-red-500" : "border-slate-200"} px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-sm`}
                  />
                  {errors.location && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <AlignLeft size={14} className="text-blue-600" /> Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className={`w-full bg-white border ${errors.description ? "border-red-500" : "border-slate-200"} px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none shadow-sm`}
                  />
                  {errors.description && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <DollarSign size={14} className="text-blue-600" /> Price ($)
                    </label>
                    <input
                      type="number"
                      {...register("price")}
                      className="w-full bg-white border border-slate-200 px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      {...register("bedrooms")}
                      className="w-full bg-white border border-slate-200 px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      {...register("bathrooms")}
                      className="w-full bg-white border border-slate-200 px-5 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Operational Status
                    </label>
                    <div className="relative">
                      <select
                        {...register("status")}
                        className="w-full bg-white border border-slate-200 px-5 py-4 rounded-[5px] text-sm font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-sm appearance-none"
                      >
                        <option value="MANAGED">MANAGED</option>
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="SOLD">SOLD</option>
                        <option value="UNDER_RENOVATION">RENOVATION</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Send size={12} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} className="text-blue-600" /> Property Media
                  </label>

                  <div className="relative group">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center gap-4 group-hover:border-blue-600 group-hover:bg-blue-50/30 transition-all text-center">
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-white group-hover:shadow-md transition-all">
                        <UploadCloud size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 block mb-1">
                          Update Assets
                        </span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          Add images or video
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Media Previews */}
                  <div className="space-y-8">
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {images.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square border border-slate-100 bg-white rounded-xl overflow-hidden group shadow-sm"
                          >
                            <img
                              src={url}
                              alt="Preview"
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-md transition-all"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {videoUrl && (
                      <div className="relative aspect-video border border-slate-100 bg-white rounded-xl overflow-hidden group shadow-sm">
                        <video
                          src={videoUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-md transition-all z-20"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute top-2.5 left-2.5 bg-blue-600 px-2 py-0.5 rounded-full shadow-lg">
                          <span className="text-[9px] font-bold text-white uppercase tracking-widest">
                            Video Protocol
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-[5px] text-xs font-bold tracking-widest uppercase hover:bg-blue-700 transition-all active:scale-[0.99] disabled:bg-slate-300 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      "Saving Updates..."
                    ) : (
                      <>
                        Update Property
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
