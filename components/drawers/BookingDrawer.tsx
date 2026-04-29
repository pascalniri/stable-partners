"use client";

import React from "react";
import { Drawer } from "vaul";
import { useBooking } from "../../hooks/useBooking";
import { Send } from "lucide-react";

export interface BookingDrawerProps {
  children: React.ReactNode;
  propertyId?: string;
  propertyName?: string;
}

export function BookingDrawer({ children, propertyId, propertyName }: BookingDrawerProps) {
  const { 
    onSubmit,
    isLoading, 
    apiError, 
    success,
    register,
    setValue,
    formState: { errors }
  } = useBooking();

  // Set propertyId if provided
  React.useEffect(() => {
    if (propertyId) {
      setValue("propertyId", propertyId);
    }
  }, [propertyId, setValue]);

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        {children}
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-sm" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[0px] h-[95vh] mt-24 fixed bottom-0 left-0 right-0 z-[201] outline-none border-t border-[#0a0a0a]/10">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 mt-4 mb-4" />
          
          <div className="flex-1 overflow-y-auto p-8 md:p-20">
            <div className="max-w-2xl mx-auto">
              <div className="mb-16">
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#2292ce] font-bold mb-6 block">Contact Terminal</span>
                <h2 className="text-md font-semibold text-[#0a0a0a]">
                  {propertyName ? `Inquiry: ${propertyName}` : "Book a Consultation."}
                </h2>
                <p className="text-[#737373] text-sm leading-relaxed mt-2">
                  {propertyName 
                    ? `You are inquiring about ${propertyName}. Please provide your details below.`
                    : "Provide your property details below. Our team will review your inquiry and contact you within 24 hours."
                  }
                </p>
              </div>

              {success ? (
                <div className="py-20 text-center border border-[#2292ce] bg-[#2292ce]/5">
                  <h3 className="text-xl font-bold text-[#0a0a0a] mb-4 uppercase tracking-tight">Inquiry Received.</h3>
                  <p className="text-[#737373] text-sm">Our desk will contact you shortly.</p>
                </div>
              ) : (
                <form className="space-y-12" onSubmit={onSubmit}>
                  {apiError && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest">
                      {apiError}
                    </div>
                  )}

                  {/* Field Group: Identity */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <label className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-widest">Full Name</label>
                        {errors.customerName && <span className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">{errors.customerName.message}</span>}
                      </div>
                      <input 
                        {...register("customerName")}
                        type="text" 
                        placeholder="Alexander Hamilton"
                        className={`w-full bg-transparent border ${errors.customerName ? 'border-red-500' : 'border-[#0a0a0a]/10'} p-4 text-xs font-medium outline-none focus:border-[#2292ce] transition-colors placeholder:text-[#a3a3a3]`}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <label className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-widest">Email Address</label>
                        {errors.customerEmail && <span className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">{errors.customerEmail.message}</span>}
                      </div>
                      <input 
                        {...register("customerEmail")}
                        type="email" 
                        placeholder="hamilton@stablepartners.com"
                        className={`w-full bg-transparent border ${errors.customerEmail ? 'border-red-500' : 'border-[#0a0a0a]/10'} p-4 text-xs font-medium outline-none focus:border-[#2292ce] transition-colors placeholder:text-[#a3a3a3]`}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <label className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-widest">Phone Number</label>
                      </div>
                      <input 
                        {...register("customerPhone")}
                        type="tel" 
                        placeholder="+1 (234) 567-890"
                        className={`w-full bg-transparent border border-[#0a0a0a]/10 p-4 text-xs font-medium outline-none focus:border-[#2292ce] transition-colors placeholder:text-[#a3a3a3]`}
                      />
                    </div>
                  </div>

                  {/* Field Group: Asset Details */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-widest">Service Level</label>
                    <select 
                      {...register("serviceType")}
                      className="w-full bg-transparent border border-[#0a0a0a]/10 p-4 text-xs font-medium outline-none focus:border-[#2292ce] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Full Management Protocol">Full Management Protocol</option>
                      <option value="Residential Leasing Inquiry">Residential Leasing Inquiry</option>
                      <option value="Property Viewing Request">Property Viewing Request</option>
                      <option value="Rent Collection & Financial Reporting">Rent Collection & Financial Reporting</option>
                      <option value="Maintenance & Asset Preservation">Maintenance & Asset Preservation</option>
                      <option value="Leasing & Tenant Vetting">Leasing & Tenant Vetting</option>
                      <option value="Strategic Asset Appreciation">Strategic Asset Appreciation</option>
                      <option value="Legal & Compliance Stewardship">Legal & Compliance Stewardship</option>
                      <option value="Short-term Rental Optimization">Short-term Rental Optimization</option>
                      <option value="Rehabilitation & Renovation Management">Rehabilitation & Renovation Management</option>
                    </select>
                  </div>

                  {/* Field Group: Additional Info */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-widest">Additional Details</label>
                    <textarea 
                      {...register("description")}
                      rows={4}
                      placeholder="Briefly describe your requirements or goals..."
                      className={`w-full bg-transparent border ${errors.description ? 'border-red-500' : 'border-[#0a0a0a]/10'} p-4 text-sm font-medium outline-none focus:border-[#2292ce] transition-colors resize-none placeholder:text-[#a3a3a3]`}
                    />
                    {errors.description && <span className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">{errors.description.message}</span>}
                  </div>

                  <div className="pt-12">
                    <button 
                      disabled={isLoading}
                      type="submit"
                      className="w-full bg-[#0a0a0a] text-white py-3 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-slate-800 transition-all disabled:bg-slate-400 flex items-center justify-center gap-3"
                    >
                      {isLoading ? "Sending Inquiry..." : <>Submit Inquiry <Send size={14} /></>}
                    </button>
                    <p className="text-center text-[10px] text-[#a3a3a3] mt-8 uppercase tracking-widest">
                      Secure end-to-end data transmission protocol active.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
