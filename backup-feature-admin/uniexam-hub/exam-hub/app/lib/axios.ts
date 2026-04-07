import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // Base URL for the unified full-stack server
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling logic (e.g., redirect to login on 401)
    return Promise.reject(error);
  }
);
