"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../lib/axiosInstance";
import { useProperties, Property } from "./useProperties";

const schema = yup.object({
  title: yup.string().required("Property title is required").min(3, "Title must be at least 3 characters"),
  location: yup.string().required("Location is required"),
  description: yup.string().required("Description is required"),
  price: yup.string().notRequired(),
  bedrooms: yup.string().notRequired(),
  bathrooms: yup.string().notRequired(),
  status: yup.string().required("Status is required"),
}).required();

export type PropertyFormData = yup.InferType<typeof schema>;

interface UsePropertyFormProps {
  property?: Property | null;
  onSuccess?: () => void;
}

export const usePropertyForm = ({ property, onSuccess }: UsePropertyFormProps = {}) => {
  const { updateProperty, createProperty, isSubmitting: isApiSubmitting } = useProperties();
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const formMethods = useForm<PropertyFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: "",
      location: "",
      description: "",
      price: "",
      bedrooms: "0",
      bathrooms: "0",
      status: "AVAILABLE"
    }
  });

  const { reset, handleSubmit: hookHandleSubmit } = formMethods;

  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        location: property.location,
        description: property.description,
        price: property.price?.toString() || "",
        bedrooms: property.bedrooms?.toString() || "0",
        bathrooms: property.bathrooms?.toString() || "0",
        status: property.status
      });
      setImages(property.images || []);
      setVideoUrl(property.videoUrl || "");
    } else {
      reset({
        title: "",
        location: "",
        description: "",
        price: "",
        bedrooms: "0",
        bathrooms: "0",
        status: "AVAILABLE"
      });
      setImages([]);
      setVideoUrl("");
    }
  }, [property, reset]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading files to secure vault...");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;
        
        const isVideo = file.type.startsWith("video/");
        
        // Get signature from our backend
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signResponse = await axiosInstance.post("/media/sign", { timestamp });
        const { signature, apiKey, cloudName } = signResponse.data;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);

        const resourceType = isVideo ? "video" : "image";
        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
          formData
        );

        if (isVideo) {
          setVideoUrl(uploadResponse.data.secure_url);
        } else {
          setImages(prev => [...prev, uploadResponse.data.secure_url]);
        }
      }
      toast.success("Files uploaded successfully.", { id: toastId });
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed. Please try again.", { id: toastId });
    } finally {
      setIsUploading(false);
      // Clear input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideoUrl("");
  };

  const onSubmit = async (data: PropertyFormData) => {
    const submitData = {
      ...data,
      price: data.price && !isNaN(parseFloat(data.price)) ? parseFloat(data.price) : undefined,
      bedrooms: data.bedrooms && !isNaN(parseInt(data.bedrooms)) ? parseInt(data.bedrooms) : 0,
      bathrooms: data.bathrooms && !isNaN(parseInt(data.bathrooms)) ? parseInt(data.bathrooms) : 0,
      images: images,
      videoUrl: videoUrl || undefined
    };

    try {
      if (property) {
        // Use realId if it exists (for adapted portfolio objects), otherwise use id
        const targetId = (property as any).realId || property.id;
        await updateProperty(targetId, submitData);
      } else {
        await createProperty(submitData);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      // Error handled by useProperties hook toasts
    }
  };

  return {
    ...formMethods,
    images,
    videoUrl,
    isSubmitting: isApiSubmitting || isUploading,
    isUploading,
    handleFileChange,
    removeImage,
    removeVideo,
    handleSubmit: hookHandleSubmit(onSubmit)
  };
};
