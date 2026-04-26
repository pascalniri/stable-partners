"use client";
import React from "react";
import { Drawer } from "vaul";
import { useAuth } from "../../hooks/useAuth";

interface AdminLoginDrawerProps {
  children: React.ReactNode;
}

export function AdminLoginDrawer({ children }: AdminLoginDrawerProps) {
  const { 
    onSubmit, 
    isLoading, 
    apiError, 
    register, 
    formState: { errors } 
  } = useAuth();

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        {children}
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-sm" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[0px] h-[70vh] mt-24 fixed bottom-0 left-0 right-0 z-[201] outline-none border-t border-[#0a0a0a]/10">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 mt-4 mb-4" />
          
          <div className="flex-1 overflow-y-auto p-8 md:p-20">
            <div className="max-w-md mx-auto">
              <div className="mb-16">
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#6ABAE9] font-bold mb-6 block">Access Terminal</span>
                <h2 className="text-md font-semibold text-[#0a0a0a]">Administrator Authentication.</h2>
                <p className="text-[#737373] text-sm leading-relaxed">
                  Enter your encrypted credentials to access the management dashboard.
                </p>
              </div>

              <form className="space-y-12" onSubmit={onSubmit}>
                {apiError && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                    {apiError}
                  </div>
                )}

                <div className="space-y-8">
                  {/* Email Field */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <label className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-widest">Identity</label>
                      {errors.email && <span className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">{errors.email.message}</span>}
                    </div>
                    <input 
                      {...register("email")}
                      type="email" 
                      placeholder="admin@stablepartners.com"
                      className={`w-full bg-transparent border ${errors.email ? 'border-red-500' : 'border-[#0a0a0a]/10'} p-4 text-sm font-medium outline-none focus:border-[#6ABAE9] transition-colors placeholder:text-[#a3a3a3]`}
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <label className="text-[10px] font-bold text-[#0a0a0a] uppercase tracking-widest">Access Key</label>
                      {errors.password && <span className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">{errors.password.message}</span>}
                    </div>
                    <input 
                      {...register("password")}
                      type="password" 
                      placeholder="••••••••"
                      className={`w-full bg-transparent border ${errors.password ? 'border-red-500' : 'border-[#0a0a0a]/10'} p-4 text-sm font-medium outline-none focus:border-[#6ABAE9] transition-colors placeholder:text-[#a3a3a3]`}
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    disabled={isLoading}
                    type="submit" 
                    className="w-full bg-[#0a0a0a] text-white py-4 text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-slate-800 transition-colors disabled:bg-slate-400"
                  >
                    {isLoading ? "Authenticating..." : "Authorize Access"}
                  </button>
                  <p className="text-center text-[10px] text-[#a3a3a3] mt-8 uppercase tracking-widest">
                    Authorized Personnel Only. Logging Active.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
