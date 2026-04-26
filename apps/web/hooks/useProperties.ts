"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axiosInstance";

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  videoUrl?: string;
  status: string;
  createdAt: string;
}

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/properties");
      setProperties(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error.response?.data?.message || "Failed to fetch properties.";
      setError(msg);
      toast.error(String(msg));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProperty = async (data: Partial<Property>) => {
    const toastId = toast.loading("Adding property to portfolio...");
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/properties", data);
      toast.success("Property registered successfully.", { id: toastId });
      await fetchProperties();
      return response.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const msg = Array.isArray(error.response?.data?.message) 
        ? error.response.data.message[0] 
        : (error.response?.data?.message || "Failed to add property.");
      toast.error(String(msg), { id: toastId });
      throw new Error(String(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProperty = async (id: string, data: Partial<Property>) => {
    const toastId = toast.loading("Updating property records...");
    setIsSubmitting(true);
    try {
      await axiosInstance.patch(`/properties/${id}`, data);
      toast.success("Records updated successfully.", { id: toastId });
      await fetchProperties();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const msg = Array.isArray(error.response?.data?.message) 
        ? error.response.data.message[0] 
        : (error.response?.data?.message || "Failed to update property.");
      toast.error(String(msg), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProperty = async (id: string) => {
    const toastId = toast.loading("Removing property from portfolio...");
    try {
      await axiosInstance.delete(`/properties/${id}`);
      toast.success("Property removed successfully.", { id: toastId });
      await fetchProperties();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to remove property.", { id: toastId });
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { 
    properties, 
    isLoading, 
    isSubmitting, 
    error, 
    refresh: fetchProperties, 
    createProperty, 
    updateProperty, 
    deleteProperty 
  };
};
