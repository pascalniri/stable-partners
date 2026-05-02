"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

// Validation Schema
const schema = yup.object().shape({
  customerName: yup.string().required("Full name is required"),
  customerPhone: yup.string().required("Phone number is required"),
  customerEmail: yup.string().email("Invalid email address").required("Email is required"),
  propertyType: yup.string().required("Please select a property type"),
  propertyLocation: yup.string().required("Location is required"),
  unitsRooms: yup.number().typeError("Must be a number").required("Required").min(1, "Must be at least 1"),
  occupancyStatus: yup.string().required("Please select occupancy status"),
  estimatedIncome: yup.string().required("Required"),
  mainChallenge: yup.string().required("Please select your main challenge"),
  mainGoal: yup.string().required("Please select your main goal"),
  additionalInfo: yup.string().ensure(),
});

type FormData = yup.InferType<typeof schema>;

export default function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("Transmitting your assessment data...");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          serviceType: "Property Assessment",
        }),
      });

      if (response.ok) {
        toast.success("Assessment request transmitted successfully.", { id: toastId });
        setSubmitted(true);
        reset();
      } else {
        const error = await response.json();
        toast.error(error.error || "Transmission failed. Please try again.", { id: toastId });
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Network error. Please check your connection.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="registration-form" className="py-24 bg-white">
        <div className="container max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 rounded-[3rem] bg-blue-50 border border-blue-100 flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white mb-8">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Assessment Booked!
            </h2>
            <p className="text-md text-slate-600 mb-8">
              Thank you for your interest. One of our property specialists will
              contact you shortly to confirm your assessment call.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-blue-600 font-bold hover:underline"
            >
              Submit another response
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="registration-form" className="py-24 bg-slate-50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-4 font-outfit">
            Let's uncover the performance of your property
          </h2>
          <p className="text-md text-slate-600">
            Fill out the form below to book your free, no-obligation property
            assessment call.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-2xl shadow-blue-900/5 border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b pb-4 font-outfit">
            Property Performance Call - Registration Form
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("customerName")}
                  placeholder="e.g. John Smith"
                  className={`w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border transition-all font-medium outline-none ${
                    errors.customerName ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600"
                  }`}
                />
                {errors.customerName && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-wide">
                    <AlertCircle size={12} /> {errors.customerName.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("customerPhone")}
                  type="tel"
                  placeholder="e.g. +44 000 000 000"
                  className={`w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border transition-all font-medium outline-none ${
                    errors.customerPhone ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600"
                  }`}
                />
                {errors.customerPhone && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-wide">
                    <AlertCircle size={12} /> {errors.customerPhone.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("customerEmail")}
                  type="email"
                  placeholder="e.g. john@example.com"
                  className={`w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border transition-all font-medium outline-none ${
                    errors.customerEmail ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600"
                  }`}
                />
                {errors.customerEmail && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-wide">
                    <AlertCircle size={12} /> {errors.customerEmail.message}
                  </p>
                )}
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("propertyType")}
                  className={`w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border transition-all font-medium outline-none appearance-none ${
                    errors.propertyType ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600"
                  }`}
                >
                  <option value="">Select type...</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Mixed-use">Mixed-use</option>
                </select>
                {errors.propertyType && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-wide">
                    <AlertCircle size={12} /> {errors.propertyType.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  Property Location <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("propertyLocation")}
                  placeholder="e.g. Zurich, Seefeld"
                  className={`w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border transition-all font-medium outline-none ${
                    errors.propertyLocation ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600"
                  }`}
                />
                {errors.propertyLocation && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-wide">
                    <AlertCircle size={12} /> {errors.propertyLocation.message}
                  </p>
                )}
              </div>

              {/* Units */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  Number of Units / Rooms <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("unitsRooms")}
                  type="number"
                  placeholder="e.g. 5"
                  className={`w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border transition-all font-medium outline-none ${
                    errors.unitsRooms ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600"
                  }`}
                />
                {errors.unitsRooms && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-wide">
                    <AlertCircle size={12} /> {errors.unitsRooms.message}
                  </p>
                )}
              </div>

              {/* Occupancy */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  Current Occupancy Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("occupancyStatus")}
                  className={`w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border transition-all font-medium outline-none appearance-none ${
                    errors.occupancyStatus ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600"
                  }`}
                >
                  <option value="">Select status...</option>
                  <option value="Fully occupied">Fully occupied</option>
                  <option value="Partially occupied">Partially occupied</option>
                  <option value="Vacant">Vacant</option>
                  <option value="Struggling to lease">Struggling to lease</option>
                </select>
                {errors.occupancyStatus && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-wide">
                    <AlertCircle size={12} /> {errors.occupancyStatus.message}
                  </p>
                )}
              </div>

              {/* Income */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  Estimated Monthly Rental Income <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("estimatedIncome")}
                  placeholder="e.g. $5,000"
                  className={`w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border transition-all font-medium outline-none ${
                    errors.estimatedIncome ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600"
                  }`}
                />
                {errors.estimatedIncome && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-wide">
                    <AlertCircle size={12} /> {errors.estimatedIncome.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Challenge */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  Main Challenge <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("mainChallenge")}
                  className={`w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border transition-all font-medium outline-none appearance-none ${
                    errors.mainChallenge ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600"
                  }`}
                >
                  <option value="">Select challenge...</option>
                  <option value="Low rent">Low rent</option>
                  <option value="Vacancies">Vacancies</option>
                  <option value="Tenant issues">Tenant issues</option>
                  <option value="High costs">High costs</option>
                  <option value="Management issues">Management issues</option>
                  <option value="Not sure">Not sure</option>
                </select>
                {errors.mainChallenge && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-wide">
                    <AlertCircle size={12} /> {errors.mainChallenge.message}
                  </p>
                )}
              </div>

              {/* Goal */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                  Main Goal <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("mainGoal")}
                  className={`w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border transition-all font-medium outline-none appearance-none ${
                    errors.mainGoal ? "border-red-300 ring-4 ring-red-50" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600"
                  }`}
                >
                  <option value="">Select goal...</option>
                  <option value="Increase income">Increase income</option>
                  <option value="Reduce vacancies">Reduce vacancies</option>
                  <option value="Improve tenants">Improve tenants</option>
                  <option value="Full management support">Full management support</option>
                  <option value="Understand potential">Understand potential</option>
                </select>
                {errors.mainGoal && (
                  <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-wide">
                    <AlertCircle size={12} /> {errors.mainGoal.message}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Additional Information (optional)
              </label>
              <textarea
                {...register("additionalInfo")}
                rows={3}
                placeholder="Anything else we should know?"
                className="w-full px-6 py-3.5 bg-slate-50 rounded-[5px] border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all resize-none font-medium outline-none"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              type="submit"
              className="group text-xs w-full tracking-[0.3em] relative px-8 py-5 bg-blue-600 text-white rounded font-bold transition-all hover:bg-blue-700 active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 disabled:bg-slate-400 uppercase"
            >
              {loading ? "PROCESSING TRANSIMISSION..." : "SUBMIT ASSESSMENT REQUEST"}
              {!loading && <Send size={15}/>}
            </button>

            <p className="text-center text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">
              * By submitting this form, you agree to our privacy policy and
              terms of service.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
