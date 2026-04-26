"use client";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "../lib/axiosInstance";

const schema = yup.object({
  customerName: yup.string().required("Full name is required").min(3, "Name must be at least 3 characters"),
  customerEmail: yup.string().email("Invalid email address").required("Email is required"),
  customerPhone: yup.string().notRequired(),
  serviceType: yup.string().required("Service level is required"),
  description: yup.string().notRequired(),
  propertyId: yup.string().notRequired(),
}).required();

export type BookingFormData = yup.InferType<typeof schema>;

export interface BookingDrawerProps {
  children: React.ReactNode;
}

export const useBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formMethods = useForm<BookingFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      serviceType: "Full Management"
    }
  });

  const { reset } = formMethods;

  const submitBooking = async (data: BookingFormData) => {
    setIsLoading(true);
    setApiError(null);
    setSuccess(false);

    try {
      const response = await axiosInstance.post("/bookings", data);
      setSuccess(true);
      reset();
      return response.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setApiError(error.response?.data?.message || "Something went wrong. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = formMethods.handleSubmit((data) => submitBooking(data));

  return { 
    submitBooking, 
    onSubmit,
    isLoading, 
    apiError, 
    success,
    ...formMethods
  };
};
