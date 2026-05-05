"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

const resetPasswordSchema = yup
  .object({
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  })
  .required();

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;

export const useResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formMethods = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit: hookHandleSubmit } = formMethods;

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error(
        "Reset token is missing. Please use the link from your email.",
      );
      return;
    }

    const toastId = toast.loading("Processing password update...");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully.", { id: toastId });
        setSubmitted(true);
        setTimeout(() => router.push("/"), 3000);
      } else {
        toast.error(result.message || "Something went wrong.", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to reset password. Please check your connection.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    ...formMethods,
    loading,
    submitted,
    handleSubmit: hookHandleSubmit(onSubmit),
    token,
  };
};
