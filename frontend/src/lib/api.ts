import axios from 'axios';

// Base API URL (configurable via env variable for production deployment)
const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();
const cleanUrl = rawApiUrl.replace(/\/+$/, '');
export const API_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

// Create an Axios instance with credentials (cookies) enabled
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token header (fallback for cross-site cookie blocking)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aisle_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
