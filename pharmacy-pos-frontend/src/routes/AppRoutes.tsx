import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { setUser, clearUser, setCheckingAuth } from '../store/slices/authSlice.js';
import { api } from '../lib/api.js';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { POSPage } from '../pages/POSPage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';
import { ProtectedRoute } from '../components/common/ProtectedRoute.js';
import { RoleGuard } from '../components/common/RoleGuard.js';
import { AppLayout } from '../components/layout/AppLayout.js';

export const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Check HttpOnly session cookie on application boot
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data.success && response.data.data.user) {
          dispatch(setUser(response.data.data.user));
        } else {
          dispatch(clearUser());
        }
      } catch {
        dispatch(clearUser());
      } finally {
        dispatch(setCheckingAuth(false));
      }
    };

    verifySession();
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* Protected App Shell Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <RoleGuard roles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT']}>
              <DashboardPage />
            </RoleGuard>
          }
        />

        {/* POS */}
        <Route
          path="/pos"
          element={
            <RoleGuard roles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST']}>
              <POSPage />
            </RoleGuard>
          }
        />

        {/* Placeholders for subsequent phases */}
        <Route path="/products" element={<div className="p-8 text-center text-slate-400">إدارة الأدوية والتصنيفات (المرحلة F06)</div>} />
        <Route path="/inventory" element={<div className="p-8 text-center text-slate-400">المخزون وتشغيلات FEFO (المرحلة F07)</div>} />
        <Route path="/purchases" element={<div className="p-8 text-center text-slate-400">الموردين وأوامر الشراء (المرحلة F09)</div>} />
        <Route path="/customers" element={<div className="p-8 text-center text-slate-400">العملاء ونقاط الولاء (المرحلة F08)</div>} />
        <Route path="/sales" element={<div className="p-8 text-center text-slate-400">سجل فواتير المبيعات (المرحلة F10)</div>} />
        <Route path="/returns" element={<div className="p-8 text-center text-slate-400">مرتجعات المبيعات (المرحلة F10)</div>} />
        <Route path="/expenses" element={<div className="p-8 text-center text-slate-400">المصروفات والعمولات (المرحلة F11)</div>} />
        <Route path="/payroll" element={<div className="p-8 text-center text-slate-400">مسيرات الرواتب Payroll (المرحلة F12)</div>} />
        <Route path="/reports" element={<div className="p-8 text-center text-slate-400">التقارير والتحليلات المالية (المرحلة F13)</div>} />
        <Route path="/notifications" element={<div className="p-8 text-center text-slate-400">التنبيهات ورسائل WhatsApp (المرحلة F14)</div>} />
        <Route path="/audit" element={<div className="p-8 text-center text-slate-400">سجلات التدقيق والأمان (المرحلة F15)</div>} />
        <Route path="/settings" element={<div className="p-8 text-center text-slate-400">إعدادات النظام والضرائب (المرحلة F16)</div>} />
        <Route path="/users" element={<div className="p-8 text-center text-slate-400">إدارة الموظفين والصلاحيات (المرحلة F17)</div>} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
