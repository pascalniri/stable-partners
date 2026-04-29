"use client";

import React from "react";
import Image from "next/image";
import { Drawer } from "vaul";
import { Star } from "lucide-react";
import { BookingDrawer } from "./BookingDrawer";

interface Property {
  id: string;
  realId: string;
  name: string;
  location: string;
  type: string;
  image: string;
  images: string[];
  description: string;
  stats: {
    beds: string;
    baths: string;
    sqft: string;
  };
}

interface PropertyDrawerProps {
  property: Property;
  children: React.ReactNode;
}

export function PropertyDrawer({ property, children }: PropertyDrawerProps) {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const images = property.images && property.images.length > 0 ? property.images : [property.image];
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        {children}
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-sm" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[0px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-[201] outline-none border-t border-[#0a0a0a]/10">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 mt-4 mb-4" />
          
          <div className="flex-1 overflow-y-auto p-8 md:p-20">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                
                 <div className="space-y-6">
                   {/* Main Stage */}
                   <div className="relative aspect-[4/5] md:aspect-square border border-[#0a0a0a]/10 overflow-hidden bg-slate-50">
                     <Image 
                       src={images[activeImageIndex] || ""} 
                       alt={property.name} 
                       fill 
                       className="object-cover transition-opacity duration-500"
                       key={activeImageIndex}
                     />
                   </div>

                   {/* Thumbnails */}
                   {images.length > 1 && (
                     <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                       {images.map((img, idx) => (
                         <button
                           key={idx}
                           onClick={() => setActiveImageIndex(idx)}
                           className={`relative w-20 h-20 flex-shrink-0 border transition-all duration-300 ${
                             activeImageIndex === idx 
                               ? "border-[#6ABAE9] ring-2 ring-[#6ABAE9]/10" 
                               : "border-[#0a0a0a]/10 opacity-60 hover:opacity-100"
                           }`}
                         >
                           <Image 
                             src={img || ""} 
                             alt={`${property.name} thumbnail ${idx}`}
                             fill
                             className="object-cover"
                           />
                         </button>
                       ))}
                     </div>
                   )}
                 </div>

                {/* Info Column */}
                <div className="flex flex-col justify-between py-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#6ABAE9] font-bold mb-8 block">{property.id} // Portfolio Asset</span>
                    <h2 className="text-[30px] md:text-[40px] font-semibold text-[#0a0a0a] mb-10 tracking-tight leading-none">{property.name}</h2>
                    
                    <div className="grid grid-cols-2 gap-12 mb-12 border-t border-b border-[#0a0a0a]/5 py-10">
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest text-[#737373] font-bold">Location</p>
                        <p className="text-sm font-bold text-[#0a0a0a] uppercase tracking-wide">{property.location}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest text-[#737373] font-bold">Asset Class</p>
                        <p className="text-sm font-bold text-[#0a0a0a] uppercase tracking-wide">{property.type}</p>
                      </div>
                    </div>

                    <p className="text-[#737373] text-[15px] leading-relaxed mb-12">
                      {property.description}
                    </p>

                    <div className="flex gap-12 mb-16">
                      <div className="space-y-1">
                        <p className="text-[24px] font-bold text-[#0a0a0a]">{property.stats.beds}</p>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-[#a3a3a3]">Bedrooms</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[24px] font-bold text-[#0a0a0a]">{property.stats.baths}</p>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-[#a3a3a3]">Bathrooms</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[24px] font-bold text-[#0a0a0a]">{property.stats.sqft}</p>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-[#a3a3a3]">Price Status</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-[#0a0a0a]/10">
                    <p className="text-[12px] text-[#737373] mb-8 font-medium italic">
                      * This property is managed with clinical precision. Interested in securing a unit here or having us manage your asset?
                    </p>
                    <BookingDrawer propertyId={property.realId} propertyName={property.name}>
                      <button className="w-full btn-primary py-4 text-[10px] font-bold tracking-[0.3em]">
                        CONNECT WITH OUR DESK
                      </button>
                    </BookingDrawer>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
