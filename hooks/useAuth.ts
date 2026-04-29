"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axiosInstance from "../lib/axiosInstance";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
}).required();

export type LoginFormData = yup.InferType<typeof loginSchema>;

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const formMethods = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await axiosInstance.post("/auth/login", data);
      const { access_token, user } = response.data;
      
      if (access_token) {
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
      return response.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setApiError(error.response?.data?.message || "Login failed. Please check your credentials.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const isAuthenticated = () => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    // Simple check: is there a token? 
    // In a production app, we'd also check JWT expiration here.
    return true;
  };

  const getUser = () => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  const onSubmit = formMethods.handleSubmit(handleLogin);

  return { 
    onSubmit, 
    logout, 
    isAuthenticated: isAuthenticated(), // Return the value for immediate use
    checkAuth: isAuthenticated, // Keep the function for manual checks
    user: getUser(),
    isLoading, 
    apiError,
    ...formMethods 
  };
};
