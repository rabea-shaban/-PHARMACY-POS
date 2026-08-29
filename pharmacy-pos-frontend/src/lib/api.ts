import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

type SessionExpiredHandler = () => void;
let onSessionExpiredCallback: SessionExpiredHandler | null = null;

export function registerSessionExpiredHandler(handler: SessionExpiredHandler) {
  onSessionExpiredCallback = handler;
}

// Resolve API Base URL dynamically across Desktop (Electron), Local Dev, and Live Cloud
const getApiBaseUrl = (): string => {
  const customUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (customUrl) {
    return customUrl as string;
  }
  // When running inside Electron packaged mode (file:// protocol)
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    return 'http://localhost:5000/api/v1';
  }
  // If running locally in browser (routed via Vite dev proxy)
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return '/api/v1';
  }
  // Default to live Vercel production backend URL
  return 'https://pharmacy-pos-pharmacy-pos-backend.vercel.app/api/v1';
};

// Base Axios instance matching Backend API
export const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // Enables sending/receiving HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for global error catching
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    // If 401 occurs on regular API requests (excluding /auth/login and initial /auth/me)
    if (status === 401 && !requestUrl.includes('/auth/login') && !requestUrl.includes('/auth/me')) {
      if (onSessionExpiredCallback) {
        onSessionExpiredCallback();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
