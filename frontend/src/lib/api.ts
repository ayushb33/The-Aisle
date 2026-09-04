import axios from 'axios';

// Base API URL (configurable via env variable for production deployment)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an Axios instance with credentials (cookies) enabled
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle token expiry or unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // You could trigger a logout event here if needed
      // e.g., useAuthStore.getState().logout() or dispatch an event
    }
    return Promise.reject(error);
  }
);
