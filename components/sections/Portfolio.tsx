"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PropertyDrawer } from "../drawers/PropertyDrawer";
import { useProperties } from "../../hooks/useProperties";

export default function Portfolio() {
  const { properties, isLoading } = useProperties();

  // Filter properties that have at least one image and are managed/available
  const displayedProperties = properties
    .filter((p) => p.images && p.images.length > 0)
    .slice(0, 6); // Limit to a reasonable number for portfolio section

  return (
    <section
      id="portfolio"
      className="py-0 bg-white border-b border-[#0a0a0a]/10"
    >
      <div className="container px-0 md:px-6">
        <div className="grid grid-cols-1 border-x border-[#0a0a0a]/10">
          {/* Header */}
          <div className="p-12 md:p-20 border-b border-[#0a0a0a]/10">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#6ABAE9] font-bold mb-6 block">
                Current Portfolio
              </span>
              <h2 className="text-md font-semibold text-[#0a0a0a] mb-8 tracking-tight leading-none">
                Properties Under <br /> Our Stewardship.
              </h2>
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {isLoading && properties.length === 0 ? (
              <div className="col-span-full py-20 text-center text-[11px] uppercase tracking-widest text-[#a3a3a3]">
                Synchronizing Portfolio...
              </div>
            ) : displayedProperties.length === 0 ? (
              <div className="col-span-full py-20 text-center text-[11px] uppercase tracking-widest text-[#a3a3a3]">
                No assets currently in portfolio.
              </div>
            ) : (
              displayedProperties.map((asset, index) => {
                // Adapt real property to the Portfolio UI format
                const prop = {
                  id: (index + 1).toString().padStart(2, "0"),
                  realId: asset.id,
                  name: asset.title,
                  location: asset.location,
                  type: asset.status,
                  image: asset.images[0] || "",
                  images: asset.images || [],
                  description: asset.description,
                  stats: {
                    beds: asset.bedrooms?.toString() || "0",
                    baths: asset.bathrooms?.toString() || "0",
                    sqft: asset.price
                      ? `${asset.price.toLocaleString()} $`
                      : "N/A",
                  },
                };

                return (
                  <PropertyDrawer key={asset.id} property={prop}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`group relative aspect-square overflow-hidden border-b border-[#0a0a0a]/10 cursor-pointer md:border-r last:md:border-r-0`}
                    >
                      <Image
                        src={prop.image}
                        alt={prop.name}
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                      />

                      {/* Info Overlay */}
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/95 transition-all duration-500 flex flex-col justify-end p-8 md:p-12 opacity-0 group-hover:opacity-100">
                        <span className="text-[10px] font-bold text-[#6ABAE9] mb-4 uppercase tracking-[0.2em]">
                          {prop.id} / {prop.type}
                        </span>
                        <h3 className="text-xl font-bold text-[#0a0a0a] mb-2 uppercase tracking-tight line-clamp-2">
                          {prop.name}
                        </h3>
                        <p className="text-[12px] text-[#737373] uppercase tracking-widest">
                          {prop.location}
                        </p>

                        <div className="mt-8 pt-6 border-t border-[#0a0a0a]/10">
                          <div className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-[0.2em] flex items-center gap-4 group/btn">
                            View Details
                            <span className="text-[#6ABAE9] group-hover:translate-x-2 transition-transform">
                              →
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </PropertyDrawer>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
