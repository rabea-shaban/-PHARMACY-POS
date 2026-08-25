import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base Axios instance matching Backend API
export const api = axios.create({
  baseURL: '/api/v1',
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
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for global error catching (e.g. 401 unauthenticated)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthenticated session - optionally trigger global auth check
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        // Soft redirect to login if session expired
        console.warn('Session expired or unauthorized. Redirecting to login.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
