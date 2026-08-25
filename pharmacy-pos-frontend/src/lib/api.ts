import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

type SessionExpiredHandler = () => void;
let onSessionExpiredCallback: SessionExpiredHandler | null = null;

export function registerSessionExpiredHandler(handler: SessionExpiredHandler) {
  onSessionExpiredCallback = handler;
}

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
