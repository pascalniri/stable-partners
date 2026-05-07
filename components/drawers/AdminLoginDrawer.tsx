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
    formState: { errors },
    getValues,
  } = useAuth();
  const [showForgot, setShowForgot] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = getValues("email");
    if (!email) return;

    setResetLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setResetSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-sm" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-3xl h-[70vh] mt-24 fixed bottom-0 left-0 right-0 z-[201] outline-none border-t border-slate-100">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 mt-4 mb-4" />

          <div className="flex-1 overflow-y-auto p-8 md:p-16">
            <div className="max-w-md mx-auto">
              <div className="mb-12 text-center">
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#1800AC] font-bold mb-4 block">
                  Access Terminal
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Administrator Authentication
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Enter your credentials to access the management dashboard.
                </p>
              </div>

              {showForgot ? (
                <form className="space-y-8" onSubmit={handleForgotSubmit}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                        Email Address
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="stablepartnersgrp@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1800AC] transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    {resetSent ? (
                      <div className="p-4 bg-green-50 border border-green-100 text-green-700 text-xs font-bold rounded-[10px] text-center">
                        Reset link sent if account exists. Check your inbox.
                      </div>
                    ) : (
                      <button
                        disabled={resetLoading}
                        type="submit"
                        className="group w-full bg-[#1800AC] text-white py-4 text-xs font-bold tracking-[0.2em] uppercase rounded hover:bg-blue-700 transition-all disabled:bg-slate-300"
                      >
                        {resetLoading ? "Sending..." : "Send Reset Link"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowForgot(false)}
                      className="w-full text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold hover:text-[#1800AC] transition-all"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              ) : (
                <form className="space-y-8" onSubmit={onSubmit}>
                  {apiError && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-[10px] text-center">
                      {apiError}
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline px-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                          Email
                        </label>
                        {errors.email && (
                          <span className="text-[10px] text-red-500 font-bold">
                            {errors.email.message}
                          </span>
                        )}
                      </div>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="stablepartnersgrp@gmail.com"
                        className={`w-full bg-slate-50 border ${errors.email ? "border-red-500" : "border-slate-200"} px-6 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1800AC] transition-all placeholder:text-slate-400`}
                      />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline px-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                          Password
                        </label>
                        {errors.password && (
                          <span className="text-[10px] text-red-500 font-bold">
                            {errors.password.message}
                          </span>
                        )}
                      </div>
                      <input
                        {...register("password")}
                        type="password"
                        placeholder="••••••••"
                        className={`w-full bg-slate-50 border ${errors.password ? "border-red-500" : "border-slate-200"} px-6 py-4 rounded-[5px] text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1800AC] transition-all placeholder:text-slate-400`}
                      />
                      <div className="flex justify-end px-1">
                        <button
                          type="button"
                          onClick={() => setShowForgot(true)}
                          className="text-[10px] text-slate-400 uppercase tracking-widest font-bold hover:text-[#1800AC] transition-all"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="group w-full bg-[#1800AC] text-white py-4 text-xs font-bold tracking-[0.2em] uppercase rounded hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-slate-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                      {isLoading ? "Authenticating..." : "Authorize Access"}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-widest font-medium">
                      Authorized Personnel Only • Secure Session Active
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
