"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Home,
  Target,
  Calendar as CalendarIcon,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import BookingCalendar from "../../BookingCalendar";

// Validation Schema
const schema = yup.object().shape({
  customerName: yup.string().required("Full name is required"),
  customerPhone: yup.string().required("Phone number is required"),
  customerEmail: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  propertyType: yup.string().required("Property type is required"),
  propertyLocation: yup.string().required("Location is required"),
  unitsRooms: yup
    .number()
    .typeError("Must be a number")
    .required("Required")
    .min(1),
  occupancyStatus: yup.string().required("Required"),
  estimatedIncome: yup.string().required("Required"),
  mainChallenge: yup.string().required("Required"),
  mainGoal: yup.string().required("Required"),
  additionalInfo: yup.string().ensure(),
  slotId: yup.string().required("Please select a time slot"),
  timezone: yup.string().required("Timezone is required"),
});

type FormData = yup.InferType<typeof schema>;

const STEPS = [
  { id: "property", title: "Property Profile", icon: Home },
  { id: "strategy", title: "Strategy & Goals", icon: Target },
  { id: "schedule", title: "Schedule Session", icon: CalendarIcon },
  { id: "contact", title: "Contact Details", icon: User },
];

export default function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (step === 0)
      fieldsToValidate = ["propertyType", "propertyLocation", "unitsRooms"];
    if (step === 1)
      fieldsToValidate = [
        "occupancyStatus",
        "estimatedIncome",
        "mainChallenge",
        "mainGoal",
      ];
    if (step === 2) fieldsToValidate = ["slotId", "timezone"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const toastId = toast.loading("Confirming your premium assessment...");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, serviceType: "Property Assessment" }),
      });

      if (response.ok) {
        toast.success("Assessment booked successfully!", { id: toastId });
        setSubmitted(true);
        reset();
      } else {
        const error = await response.json();
        toast.error(error.error || "Submission failed.", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section
        id="registration-form"
        className="py-24 bg-white min-h-[600px] flex items-center"
      >
        <div className="container max-w-2xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 rounded-[5px] bg-blue-50 border border-blue-100 flex flex-col items-center shadow-sm"
          >
            <div className="w-24 h-24 bg-[#1800AC] rounded-full flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-500/20">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-outfit">
              Confirmation Sent
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Your property assessment session has been reserved. You will
              receive an initial confirmation email shortly, followed by the
              final calendar invitation once our specialists review your
              profile.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(0);
              }}
              className="text-[#1800AC] font-black uppercase tracking-widest text-xs hover:underline"
            >
              Book Another Assessment
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="registration-form" className="py-24 bg-slate-50/50">
      <div className="container px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-outfit tracking-tight">
            Elevate your property performance
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Begin your journey toward maximized returns with a bespoke property
            assessment call.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-12 relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 -z-10" />
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                    i <= step
                      ? "bg-[#1800AC] border-white text-white shadow-lg"
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  <s.icon size={18} />
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest hidden md:block ${i <= step ? "text-[#1800AC]" : "text-slate-400"}`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 md:p-12 rounded-[5px] border border-slate-200 min-h-[500px] flex flex-col">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step Title */}
                  <div className="mb-10">
                    <span className="text-[10px] font-black text-[#1800AC] uppercase tracking-[0.3em] mb-2 block">
                      Step 0{step + 1}
                    </span>
                    <h3 className="text-3xl font-bold text-slate-900 font-outfit">
                      {STEPS[step].title}
                    </h3>
                  </div>

                  {step === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Property Type *
                        </label>
                        <select
                          {...register("propertyType")}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold"
                        >
                          <option value="">Select type...</option>
                          <option value="Apartment">Apartment</option>
                          <option value="House">House</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Mixed-use">Mixed-use</option>
                        </select>
                        {errors.propertyType && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                            {errors.propertyType.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Location *
                        </label>
                        <input
                          {...register("propertyLocation")}
                          placeholder="e.g. Zurich"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Units/Rooms *
                        </label>
                        <input
                          {...register("unitsRooms")}
                          type="number"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Main Challenge *
                        </label>
                        <select
                          {...register("mainChallenge")}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold"
                        >
                          <option value="">Select challenge...</option>
                          <option value="Low rent">Low rent</option>
                          <option value="Vacancies">Vacancies</option>
                          <option value="Management issues">
                            Management issues
                          </option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Main Goal *
                        </label>
                        <select
                          {...register("mainGoal")}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold"
                        >
                          <option value="">Select goal...</option>
                          <option value="Increase income">
                            Increase income
                          </option>
                          <option value="Improve tenants">
                            Improve tenants
                          </option>
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Estimated Income *
                        </label>
                        <input
                          {...register("estimatedIncome")}
                          placeholder="e.g. $5,000/mo"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Occupancy Status *
                        </label>
                        <select
                          {...register("occupancyStatus")}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold"
                        >
                          <option value="">Select status...</option>
                          <option value="Fully occupied">Fully occupied</option>
                          <option value="Vacant">Vacant</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <BookingCalendar
                        selectedSlotId={watch("slotId")}
                        onSelect={(id, tz) => {
                          setValue("slotId", id);
                          setValue("timezone", tz);
                          trigger("slotId");
                        }}
                      />
                      {errors.slotId && (
                        <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1 text-center">
                          {errors.slotId.message}
                        </p>
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Full Name *
                        </label>
                        <input
                          {...register("customerName")}
                          placeholder="John Smith"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold"
                        />
                        {errors.customerName && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                            {errors.customerName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Email Address *
                        </label>
                        <input
                          {...register("customerEmail")}
                          placeholder="john@example.com"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Phone Number *
                        </label>
                        <input
                          {...register("customerPhone")}
                          placeholder="+44 000 000 000"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Additional Notes
                        </label>
                        <textarea
                          {...register("additionalInfo")}
                          rows={3}
                          placeholder="Anything else?"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold resize-none"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-100">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 0 || loading}
                className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
                  step === 0
                    ? "opacity-0 pointer-events-none"
                    : "text-slate-400 hover:text-slate-900"
                }`}
              >
                <ArrowLeft size={14} /> Back
              </button>

              {step === STEPS.length - 1 ? (
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  className="flex items-center gap-3 px-10 py-4 bg-[#1800AC] text-white rounded-[5px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-all active:scale-95 disabled:bg-slate-300"
                >
                  {loading ? "Confirming..." : "Finalize Booking"}
                  <Send size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-[5px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95"
                >
                  Continue <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
