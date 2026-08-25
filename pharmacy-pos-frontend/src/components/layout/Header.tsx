import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice.js';
import { clearUser } from '../../store/slices/authSlice.js';
import { api } from '../../lib/api.js';
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  Bell,
  User as UserIcon,
} from 'lucide-react';
import { Badge } from '../ui/Badge.js';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);
  const { unreadCount } = useAppSelector((state) => state.notifications);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore
    } finally {
      dispatch(clearUser());
      window.location.href = '/login';
    }
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'PLATFORM_MANAGER':
        return <Badge variant="danger">مدير النظام (Super Admin)</Badge>;
      case 'PHARMACY_MANAGER':
        return <Badge variant="warning">مدير الصيدلية</Badge>;
      case 'PHARMACIST':
        return <Badge variant="info">صيدلي</Badge>;
      case 'ACCOUNTANT':
        return <Badge variant="success">محاسب</Badge>;
      default:
        return null;
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#0E1522] border-b border-slate-200/80 dark:border-[#1E293B] px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors">
      {/* Left side: Hamburger Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2.5 rounded-2xl text-slate-600 hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-[#1A2639] dark:hover:text-white transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right side: Notifications, Theme, User Avatar, Logout */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-2xl text-slate-600 hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-[#1A2639] dark:hover:text-amber-400 transition-colors cursor-pointer"
          aria-label="Toggle Theme"
          title={theme === 'light' ? 'التبديل إلى الوضع الليلي (Dark Mode)' : 'التبديل إلى الوضع الفاتح (Light Mode)'}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Notifications Icon */}
        <Link
          to="/notifications"
          className="relative p-2.5 rounded-2xl text-slate-600 hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-[#1A2639] dark:hover:text-white transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-white text-[9px] font-bold">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-[#1E293B] mx-1" />

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center font-bold text-sm">
            <UserIcon className="w-5 h-5" />
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
              {user?.name || 'مستخدم النظام'}
            </p>
            <div className="mt-1">{getRoleBadge()}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="تسجيل الخروج"
          className="p-2.5 rounded-2xl text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/70 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
