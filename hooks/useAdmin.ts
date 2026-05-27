"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axiosInstance";
import { Property } from "./useProperties";

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  
  // Property Assessment Fields
  propertyType?: string;
  propertyLocation?: string;
  unitsRooms?: string;
  occupancyStatus?: string;
  estimatedIncome?: string;
  currency?: string;
  mainChallenge?: string;
  mainGoal?: string;
  additionalInfo?: string;

  serviceType: string;
  description?: string;
  status: "PENDING" | "REPLIED" | "COMPLETED" | "CANCELLED";
  meetingDate?: string;
  meetingLink?: string;
  propertyId?: string;
  slotId?: string;
  sessionId?: string;
  timezone?: string;
  slot?: {
    id: string;
    startTime: string;
    endTime: string;
  };
  session?: {
    id: string;
    startTime: string;
    endTime: string;
  };
  property?: Property;
  createdAt: string;
}

export const useAdmin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/admin/bookings");
      setBookings(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error.response?.data?.message || "Failed to fetch bookings.";
      setError(msg);
      toast.error(String(msg));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const replyToBooking = async (id: string, details: { scheduledDate: string, meetingLink: string, message: string }) => {
    const toastId = toast.loading("Processing response...");
    setIsSubmitting(true);
    setIsSuccess(false);
    try {
      await axiosInstance.post(`/admin/bookings/${id}/reply`, details);
      toast.success("Response transmitted successfully.", { id: toastId });
      setIsSuccess(true);
      await fetchBookings(); // Refresh list
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const responseMsg = error.response?.data?.message;
      const msg = Array.isArray(responseMsg) 
        ? responseMsg[0] 
        : (responseMsg || "Failed to send reply.");
        
      toast.error(String(msg), { id: toastId });
      throw new Error(String(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  const declineBooking = async (id: string) => {
    const toastId = toast.loading("Processing cancellation...");
    setIsSubmitting(true);
    setIsSuccess(false);
    try {
      await axiosInstance.post(`/admin/bookings/${id}/decline`);
      toast.success("Booking declined and slot re-opened.", { id: toastId });
      setIsSuccess(true);
      await fetchBookings();
    } catch (err: unknown) {
      toast.error("Failed to decline booking.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, isLoading, isSubmitting, isSuccess, error, refresh: fetchBookings, replyToBooking, declineBooking };
};
