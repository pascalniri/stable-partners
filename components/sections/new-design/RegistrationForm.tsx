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
interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  propertyType: string;
  propertyTypeOther?: string | null;
  propertyLocation?: string | null;
  unitsRooms?: number | null;
  occupancyStatus: string;
  occupancyStatusOther?: string | null;
  estimatedIncome?: string | null;
  mainChallenge: string;
  mainGoal: string;
  mainGoalOther?: string | null;
  mainChallengeOther?: string | null;
  additionalInfo?: string | null;
  slotId: string;
  timezone: string;
}

const schema: yup.ObjectSchema<FormData> = yup.object({
  customerName: yup.string().required("Full name is required"),
  customerPhone: yup.string().required("Phone number is required"),
  customerEmail: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  propertyType: yup.string().required("Property type is required"),
  propertyTypeOther: yup.string().when("propertyType", {
    is: "Other",
    then: (schema) => schema.required("Please specify your property type"),
    otherwise: (schema) => schema.notRequired(),
  }),
  propertyLocation: yup.string().notRequired(),
  unitsRooms: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .notRequired(),
  occupancyStatus: yup.string().required("Required"),
  occupancyStatusOther: yup.string().when("occupancyStatus", {
    is: "Other (Please specify)",
    then: (schema) => schema.required("Please specify occupancy status"),
    otherwise: (schema) => schema.notRequired(),
  }),
  estimatedIncome: yup.string().notRequired(),
  mainChallenge: yup.string().required("Required"),
  mainChallengeOther: yup.string().when("mainChallenge", {
    is: "Other (Please specify)",
    then: (schema) => schema.required("Please specify your challenge"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mainGoal: yup.string().required("Required"),
  mainGoalOther: yup.string().when("mainGoal", {
    is: "Other (Please specify)",
    then: (schema) => schema.required("Please specify your objective"),
    otherwise: (schema) => schema.notRequired(),
  }),
  additionalInfo: yup.string().notRequired(),
  slotId: yup.string().required("Please select a time slot"),
  timezone: yup.string().required("Timezone is required"),
});

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
      fieldsToValidate = ["propertyType", "propertyTypeOther", "propertyLocation", "unitsRooms"];
    if (step === 1)
      fieldsToValidate = [
        "occupancyStatus",
        "occupancyStatusOther",
        "estimatedIncome",
        "mainChallenge",
        "mainChallengeOther",
        "mainGoal",
        "mainGoalOther",
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
      const submissionData = {
        ...data,
        propertyType: data.propertyType === "Other" ? data.propertyTypeOther : data.propertyType,
        mainChallenge: data.mainChallenge === "Other (Please specify)" ? data.mainChallengeOther : data.mainChallenge,
        mainGoal: data.mainGoal === "Other (Please specify)" ? data.mainGoalOther : data.mainGoal,
        occupancyStatus: data.occupancyStatus === "Other (Please specify)" ? data.occupancyStatusOther : data.occupancyStatus,
        serviceType: "Property Assessment",
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
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
                          Asset Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("propertyType")}
                          className={`w-full px-6 py-3 bg-slate-50 border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold ${
                            errors.propertyType ? "border-red-500" : "border-slate-200"
                          }`}
                        >
                          <option value="">Select type...</option>
                          <option value="House (Single-Family)">House (Single-Family)</option>
                          <option value="Apartment / Condo">Apartment / Condo</option>
                          <option value="Commercial (Office/Retail)">Commercial (Office/Retail)</option>
                          <option value="Mixed-Use (Residential & Commercial)">Mixed-Use (Residential & Commercial)</option>
                          <option value="Other">Other</option>
                        </select>
                        <p className="text-[10px] text-slate-400 ml-1">Select the classification that best describes your property.</p>
                        {errors.propertyType && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                            {errors.propertyType.message}
                          </p>
                        )}

                        <AnimatePresence>
                          {watch("propertyType") === "Other" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2 space-y-2"
                            >
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                Specify Property Type <span className="text-red-500">*</span>
                              </label>
                              <input
                                {...register("propertyTypeOther")}
                                placeholder="e.g. Warehouse, Industrial..."
                                className={`w-full px-6 py-3 bg-white border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold text-sm ${
                                  errors.propertyTypeOther ? "border-red-500" : "border-slate-200"
                                }`}
                              />
                              {errors.propertyTypeOther && (
                                <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                                  {errors.propertyTypeOther.message}
                                </p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Property Location
                        </label>
                        <input
                          {...register("propertyLocation")}
                          placeholder="e.g. Kigali, Rwanda"
                          className={`w-full px-6 py-3 bg-slate-50 border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold ${
                            errors.propertyLocation ? "border-red-500" : "border-slate-200"
                          }`}
                        />
                        <p className="text-[10px] text-slate-400 ml-1">The primary city or region of the asset.</p>
                        {errors.propertyLocation && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                            {errors.propertyLocation.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Total Number of Units
                        </label>
                        <input
                          {...register("unitsRooms")}
                          type="number"
                          className={`w-full px-6 py-3 bg-slate-50 border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold ${
                            errors.unitsRooms ? "border-red-500" : "border-slate-200"
                          }`}
                        />
                        <p className="text-[10px] text-slate-400 ml-1">Total number of individual spaces available.</p>
                        {errors.unitsRooms && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                            {errors.unitsRooms.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Primary Challenge <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("mainChallenge")}
                          className={`w-full px-6 py-3 bg-slate-50 border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold ${
                            errors.mainChallenge ? "border-red-500" : "border-slate-200"
                          }`}
                        >
                          <option value="">Select challenge...</option>
                          <option value="Maintenance & Repairs (Corrective)">Maintenance & Repairs (Corrective)</option>
                          <option value="Preventive Maintenance Planning">Preventive Maintenance Planning</option>
                          <option value="Tenant Relations & Rent Collection">Tenant Relations & Rent Collection</option>
                          <option value="Vendor & Contractor Management">Vendor & Contractor Management</option>
                          <option value="Health, Safety, & Regulatory Compliance">Health, Safety, & Regulatory Compliance</option>
                          <option value="High Operating Costs / Utility Waste">High Operating Costs / Utility Waste</option>
                          <option value="Administrative & Financial Reporting">Administrative & Financial Reporting</option>
                          <option value="Other (Please specify)">Other (Please specify)</option>
                        </select>
                        <p className="text-[10px] text-slate-400 ml-1">Identify the biggest hurdle in your current management.</p>
                        {errors.mainChallenge && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                            {errors.mainChallenge.message}
                          </p>
                        )}

                        <AnimatePresence>
                          {watch("mainChallenge") === "Other (Please specify)" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2 space-y-2"
                            >
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                Specify Challenge <span className="text-red-500">*</span>
                              </label>
                              <input
                                {...register("mainChallengeOther")}
                                placeholder="Describe your biggest hurdle..."
                                className={`w-full px-6 py-3 bg-white border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold text-sm ${
                                  errors.mainChallengeOther ? "border-red-500" : "border-slate-200"
                                }`}
                              />
                              {errors.mainChallengeOther && (
                                <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                                  {errors.mainChallengeOther.message}
                                </p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Key Objective <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("mainGoal")}
                          className={`w-full px-6 py-3 bg-slate-50 border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold ${
                            errors.mainGoal ? "border-red-500" : "border-slate-200"
                          }`}
                        >
                          <option value="">Select goal...</option>
                          <option value="Reduce Operational Costs">Reduce Operational Costs</option>
                          <option value="Improve Tenant Retention">Improve Tenant Retention</option>
                          <option value="Increase Asset Lifecycle / Value">Increase Asset Lifecycle / Value</option>
                          <option value="Ensure Regulatory Compliance">Ensure Regulatory Compliance</option>
                          <option value="Streamline Daily Operations">Streamline Daily Operations</option>
                          <option value="Maximise Rental Yield">Maximise Rental Yield</option>
                          <option value="Other (Please specify)">Other (Please specify)</option>
                        </select>
                        <p className="text-[10px] text-slate-400 ml-1">What is your primary priority for this property?</p>
                        {errors.mainGoal && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                            {errors.mainGoal.message}
                          </p>
                        )}

                        <AnimatePresence>
                          {watch("mainGoal") === "Other (Please specify)" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2 space-y-2"
                            >
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                Specify Objective <span className="text-red-500">*</span>
                              </label>
                              <input
                                {...register("mainGoalOther")}
                                placeholder="Describe your primary goal..."
                                className={`w-full px-6 py-3 bg-white border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold text-sm ${
                                  errors.mainGoalOther ? "border-red-500" : "border-slate-200"
                                }`}
                              />
                              {errors.mainGoalOther && (
                                <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                                  {errors.mainGoalOther.message}
                                </p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Estimated Monthly Revenue
                        </label>
                        <input
                          {...register("estimatedIncome")}
                          placeholder="e.g. $5,000/mo"
                          className={`w-full px-6 py-3 bg-slate-50 border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold ${
                            errors.estimatedIncome ? "border-red-500" : "border-slate-200"
                          }`}
                        />
                        <p className="text-[10px] text-slate-400 ml-1">Your current average monthly income from this asset.</p>
                        {errors.estimatedIncome && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                            {errors.estimatedIncome.message}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Current Occupancy <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("occupancyStatus")}
                          className={`w-full px-6 py-3 bg-slate-50 border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold ${
                            errors.occupancyStatus ? "border-red-500" : "border-slate-200"
                          }`}
                        >
                          <option value="">Select status...</option>
                          <option value="Fully Occupied / Operational">Fully Occupied / Operational</option>
                          <option value="Partially Occupied / Shared">Partially Occupied / Shared</option>
                          <option value="Vacant / Non-Operational">Vacant / Non-Operational</option>
                          <option value="Under Renovation / Fit-out">Under Renovation / Fit-out</option>
                          <option value="Notice Given (Pending Vacancy)">Notice Given (Pending Vacancy)</option>
                          <option value="Other (Please specify)">Other (Please specify)</option>
                        </select>
                        <p className="text-[10px] text-slate-400 ml-1">The current usage state of your property.</p>
                        {errors.occupancyStatus && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                            {errors.occupancyStatus.message}
                          </p>
                        )}

                        <AnimatePresence>
                          {watch("occupancyStatus") === "Other (Please specify)" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2 space-y-2"
                            >
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                Specify Occupancy Status <span className="text-red-500">*</span>
                              </label>
                              <input
                                {...register("occupancyStatusOther")}
                                placeholder="Describe current occupancy..."
                                className={`w-full px-6 py-3 bg-white border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold text-sm ${
                                  errors.occupancyStatusOther ? "border-red-500" : "border-slate-200"
                                }`}
                              />
                              {errors.occupancyStatusOther && (
                                <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                                  {errors.occupancyStatusOther.message}
                                </p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
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
                          Client Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("customerName")}
                          placeholder="John Smith"
                          className={`w-full px-6 py-3 bg-slate-50 border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold ${
                            errors.customerName ? "border-red-500" : "border-slate-200"
                          }`}
                        />
                        <p className="text-[10px] text-slate-400 ml-1">Your legal name for documentation.</p>
                        {errors.customerName && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                            {errors.customerName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Professional Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("customerEmail")}
                          placeholder="john@example.com"
                          className={`w-full px-6 py-3 bg-slate-50 border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold ${
                            errors.customerEmail ? "border-red-500" : "border-slate-200"
                          }`}
                        />
                        <p className="text-[10px] text-slate-400 ml-1">We will send the assessment report here.</p>
                        {errors.customerEmail && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                            {errors.customerEmail.message}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("customerPhone")}
                          placeholder="+44 000 000 000"
                          className={`w-full px-6 py-3 bg-slate-50 border rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold ${
                            errors.customerPhone ? "border-red-500" : "border-slate-200"
                          }`}
                        />
                        <p className="text-[10px] text-slate-400 ml-1">Best number for our specialists to reach you.</p>
                        {errors.customerPhone && (
                          <p className="text-[10px] text-red-500 font-bold uppercase mt-1 ml-1">
                            {errors.customerPhone.message}
                          </p>
                        )}
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Additional Notes
                        </label>
                        <textarea
                          {...register("additionalInfo")}
                          rows={3}
                          placeholder="Anything else?"
                          className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-[5px] focus:ring-4 focus:ring-blue-500/10 focus:border-[#1800AC] transition-all outline-none font-bold resize-none"
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
