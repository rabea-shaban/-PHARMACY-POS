import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { setUser, clearUser, setCheckingAuth, setSessionExpired } from '../store/slices/authSlice.js';
import { authApi } from '../features/auth/api/authApi.js';
import { registerSessionExpiredHandler } from '../lib/api.js';
import { queryClient } from '../lib/queryClient.js';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { POSPage } from '../pages/POSPage.js';
import { ForbiddenPage } from '../pages/ForbiddenPage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';
import { ProtectedRoute } from '../components/common/ProtectedRoute.js';
import { RoleGuard } from '../components/common/RoleGuard.js';
import { AppLayout } from '../components/layout/AppLayout.js';
import { MODULE_PERMISSIONS, getDefaultRouteForRole } from '../config/permissions.js';

export const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  // Register session expired handler for Axios 401 interceptor
  useEffect(() => {
    registerSessionExpiredHandler(() => {
      dispatch(setSessionExpired(true));
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      navigate('/login', { replace: true });
    });
  }, [dispatch, navigate]);

  // Auth Bootstrap: Verify HttpOnly Session Cookie on application load
  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        const user = await authApi.getMe();
        if (isMounted && user) {
          dispatch(setUser(user));
          queryClient.setQueryData(['currentUser'], user);
        }
      } catch {
        if (isMounted) {
          dispatch(clearUser());
        }
      } finally {
        if (isMounted) {
          dispatch(setCheckingAuth(false));
        }
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const defaultDestination = getDefaultRouteForRole(role);

  return (
    <Routes>
      {/* Public Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                (location.state as any)?.from?.pathname && (location.state as any)?.from?.pathname !== '/login'
                  ? (location.state as any).from.pathname
                  : defaultDestination
              }
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Protected App Layout Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Root redirect */}
        <Route path="/" element={<Navigate to={defaultDestination} replace />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.dashboard}>
              <DashboardPage />
            </RoleGuard>
          }
        />

        {/* POS Cashier */}
        <Route
          path="/pos"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.pos}>
              <POSPage />
            </RoleGuard>
          }
        />

        {/* Forbidden Page (403) */}
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* Subsequent phase placeholders protected by RBAC */}
        <Route
          path="/products"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.products}>
              <div className="p-8 text-center text-slate-400">إدارة الأدوية والتصنيفات (المرحلة F06)</div>
            </RoleGuard>
          }
        />
        <Route
          path="/inventory"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.inventory}>
              <div className="p-8 text-center text-slate-400">المخزون وتشغيلات FEFO (المرحلة F07)</div>
            </RoleGuard>
          }
        />
        <Route
          path="/purchases"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.purchases}>
              <div className="p-8 text-center text-slate-400">الموردين وأوامر الشراء (المرحلة F09)</div>
            </RoleGuard>
          }
        />
        <Route
          path="/customers"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.customers}>
              <div className="p-8 text-center text-slate-400">العملاء ونقاط الولاء (المرحلة F08)</div>
            </RoleGuard>
          }
        />
        <Route
          path="/sales"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.sales}>
              <div className="p-8 text-center text-slate-400">سجل فواتير المبيعات (المرحلة F10)</div>
            </RoleGuard>
          }
        />
        <Route
          path="/returns"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.returns}>
              <div className="p-8 text-center text-slate-400">مرتجعات المبيعات (المرحلة F10)</div>
            </RoleGuard>
          }
        />
        <Route
          path="/expenses"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.expenses}>
              <div className="p-8 text-center text-slate-400">المصروفات والعمولات (المرحلة F11)</div>
            </RoleGuard>
          }
        />
        <Route
          path="/payroll"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.payroll}>
              <div className="p-8 text-center text-slate-400">مسيرات الرواتب والأجور (المرحلة F12)</div>
            </RoleGuard>
          }
        />
        <Route
          path="/reports"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.reports}>
              <div className="p-8 text-center text-slate-400">التقارير والتحليلات المالية (المرحلة F13)</div>
            </RoleGuard>
          }
        />
        <Route
          path="/notifications"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.notifications}>
              <div className="p-8 text-center text-slate-400">مركز التنبيهات والواتساب (المرحلة F14)</div>
            </RoleGuard>
          }
        />
        <Route
          path="/audit"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.audit}>
              <div className="p-8 text-center text-slate-400">سجلات التدقيق والأمان (المرحلة F15)</div>
            </RoleGuard>
          }
        />
        <Route
          path="/settings"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.settings}>
              <div className="p-8 text-center text-slate-400">إعدادات النظام والضرائب (المرحلة F16)</div>
            </RoleGuard>
          }
        />
        <Route
          path="/users"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.users}>
              <div className="p-8 text-center text-slate-400">إدارة الموظفين والصلاحيات (المرحلة F17)</div>
            </RoleGuard>
          }
        />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
