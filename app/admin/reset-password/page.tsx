"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send, CheckCircle, Lock, AlertCircle } from "lucide-react";
import { useResetPassword } from "@/hooks/useResetPassword";

function ResetPasswordForm() {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    loading,
    submitted,
    handleSubmit,
    token,
  } = useResetPassword();

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-12 rounded-[3rem] bg-blue-50 border border-blue-100 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-[#1800AC] rounded-full flex items-center justify-center text-white mb-8">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 font-outfit">
            Security Updated!
          </h2>
          <p className="text-md text-slate-600 mb-8">
            Your administrative password has been reset. You will be redirected
            to the portal login shortly.
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-[#1800AC] font-bold hover:underline uppercase tracking-widest text-xs"
          >
            Go to Login Now
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full">
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-4 font-outfit uppercase tracking-tight">
            Security Management Terminal
          </h2>
          <p className="text-md text-slate-600">
            Please establish your new administrative credentials to regain
            access to the dashboard.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-[10px] shadow-2xl shadow-blue-900/5 border border-slate-100 "
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b pb-4 font-outfit flex items-center gap-3">
            <Lock className="text-[#1800AC]" size={24} />
            Reset Administrator Password
          </h3>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  New Secure Password <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border transition-all font-medium outline-none ${
                    errors.password
                      ? "border-red-300 ring-4 ring-red-50"
                      : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC]"
                  }`}
                />
                {errors.password && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-wide">
                    <AlertCircle size={12} /> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border transition-all font-medium outline-none ${
                    errors.confirmPassword
                      ? "border-red-300 ring-4 ring-red-50"
                      : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC]"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-wide">
                    <AlertCircle size={12} /> {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                disabled={loading || !token}
                type="submit"
                className="group text-xs w-full tracking-[0.3em] relative px-8 py-5 bg-[#1800AC] text-white rounded font-bold transition-all hover:bg-blue-700 active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 disabled:bg-slate-400 uppercase"
              >
                {loading
                  ? "PROCESSING SECURITY UPDATE..."
                  : "UPDATE ADMINISTRATIVE PASSWORD"}
                {!loading && <Send size={15} />}
              </button>
            </div>

            <p className="text-center text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">
              Authorized Personnel Only • Secure Encryption Active
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
