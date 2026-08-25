import { useAppDispatch, useAppSelector } from '../../../store/hooks.js';
import { setUser, clearUser, setCheckingAuth } from '../../../store/slices/authSlice.js';
import { authApi } from '../api/authApi.js';
import { LoginPayload } from '../types/auth.types.js';
import { Role } from '../../../types/auth.types.js';
import { queryClient } from '../../../lib/queryClient.js';
import { getDefaultRouteForRole } from '../../../config/permissions.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import i18n from '../../../lib/i18n.js';

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, role, isAuthenticated, isCheckingAuth } = useAppSelector((state) => state.auth);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Login handler
  const login = async (credentials: LoginPayload) => {
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const result = await authApi.login(credentials);
      
      // 1. Sync safe user into Redux (Never store accessToken in Redux/localStorage)
      dispatch(setUser(result.user));

      // 2. Sync into TanStack Query cache
      queryClient.setQueryData(['currentUser'], result.user);

      // 3. Determine redirect destination (respect safe returnTo)
      const fromPath = (location.state as any)?.from?.pathname;
      const destination = fromPath && fromPath !== '/login' ? fromPath : getDefaultRouteForRole(result.user.role);

      navigate(destination, { replace: true });
      return result.user;
    } catch (error: any) {
      const backendMessage = error.response?.data?.message;
      const status = error.response?.status;

      let formattedError = backendMessage;
      if (!formattedError) {
        if (status === 401) {
          formattedError = i18n.language === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials';
        } else if (status === 403) {
          formattedError = i18n.language === 'ar' ? 'هذا الحساب غير مفعل' : 'This account is disabled';
        } else if (!error.response) {
          formattedError = i18n.language === 'ar' ? 'تعذر الاتصال بالخادم، يرجى التحقق من اتصالك' : 'Unable to connect to the server';
        } else {
          formattedError = i18n.language === 'ar' ? 'حدث خطأ غير متوقع أثناء تسجيل الدخول' : 'An unexpected error occurred during sign in';
        }
      }

      setLoginError(formattedError);
      throw new Error(formattedError);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore if session already expired on server
    } finally {
      // 1. Clear Redux
      dispatch(clearUser());

      // 2. Clear TanStack cache
      queryClient.removeQueries({ queryKey: ['currentUser'] });

      // 3. Navigate to login
      navigate('/login', { replace: true });
    }
  };

  // Role verification helper
  const hasRole = (allowedRoles: Role[]): boolean => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  return {
    user,
    role,
    isAuthenticated,
    isCheckingAuth,
    isLoggingIn,
    loginError,
    setLoginError,
    login,
    logout,
    hasRole,
    setUser: (u: any) => dispatch(setUser(u)),
    clearUser: () => dispatch(clearUser()),
    setCheckingAuth: (c: boolean) => dispatch(setCheckingAuth(c)),
  };
}
