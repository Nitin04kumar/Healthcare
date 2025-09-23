// src/utils/axiosInstance.ts

import axios from "axios";
import { refreshToken as refreshApiCall } from "../api/authService";

// We need a way to communicate back to the AuthContext
// This creates a simple event system
const events = new EventTarget();
export const onAuthRefresh = (callback: (token: string) => void) => {
  const handler = (event: Event) => callback((event as CustomEvent).detail);
  events.addEventListener("authRefreshed", handler);
  return () => events.removeEventListener("authRefreshed", handler);
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: true,
});

// We no longer need a request interceptor because cookies are sent automatically.

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for an auth error (401 or 403) and avoid retrying
    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Attempting token refresh");
        const refreshResponse = await refreshApiCall();
        console.log("Token refresh response", refreshResponse);
        const newAccessToken = refreshResponse.accessToken;

        // Dispatch an event with the new token so AuthContext can update itself
        events.dispatchEvent(
          new CustomEvent("authRefreshed", { detail: newAccessToken })
        );

        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Clear session and redirect
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
