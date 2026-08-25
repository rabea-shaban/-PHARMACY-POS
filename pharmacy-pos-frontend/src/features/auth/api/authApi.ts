import { api } from '../../../lib/api.js';
import { ApiResponse } from '../../../types/api.types.js';
import { User } from '../../../types/auth.types.js';
import { LoginPayload, BackendLoginResponse } from '../types/auth.types.js';

export const authApi = {
  login: async (credentials: LoginPayload): Promise<BackendLoginResponse> => {
    const isEmail = credentials.identifier.includes('@');
    const isPhone = /^[0-9+]+$/.test(credentials.identifier);

    const payload: Record<string, string> = {
      password: credentials.password,
    };

    if (isEmail) {
      payload.email = credentials.identifier;
    } else if (isPhone) {
      payload.phone = credentials.identifier;
    }
    payload.identifier = credentials.identifier;

    const response = await api.post<ApiResponse<BackendLoginResponse>>('/auth/login', payload);
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post<ApiResponse<null>>('/auth/logout');
  },
};
