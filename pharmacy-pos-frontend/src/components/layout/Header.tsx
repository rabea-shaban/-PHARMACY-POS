import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { toggleSidebar, toggleTheme, toggleLanguage } from '../../store/slices/uiSlice.js';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  Bell,
  Languages,
  User as UserIcon,
} from 'lucide-react';
import { Badge } from '../ui/Badge.js';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);
  const { theme, language } = useAppSelector((state) => state.ui);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const { logout } = useAuth();

  const getRoleBadge = () => {
    switch (role) {
      case 'PLATFORM_MANAGER':
        return <Badge variant="danger">{t('roles.PLATFORM_MANAGER')}</Badge>;
      case 'PHARMACY_MANAGER':
        return <Badge variant="warning">{t('roles.PHARMACY_MANAGER')}</Badge>;
      case 'PHARMACIST':
        return <Badge variant="info">{t('roles.PHARMACIST')}</Badge>;
      case 'ACCOUNTANT':
        return <Badge variant="success">{t('roles.ACCOUNTANT')}</Badge>;
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
          className="p-2.5 rounded-2xl text-slate-600 hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-[#1A2639] dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right side: Language, Theme, Notifications, User Avatar, Logout */}
      <div className="flex items-center gap-2.5">
        {/* Language Switcher Button */}
        <button
          type="button"
          onClick={() => dispatch(toggleLanguage())}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-700 dark:bg-[#1A2639] dark:text-slate-200 dark:hover:bg-[#22334C] transition-colors cursor-pointer"
          title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
        >
          <Languages className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>{language === 'ar' ? 'English' : 'عربي'}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-2xl text-slate-600 hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-[#1A2639] dark:hover:text-amber-400 transition-colors cursor-pointer"
          aria-label="Toggle Theme"
          title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
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
          <div className="hidden md:block text-start">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
              {user?.name || (language === 'ar' ? 'مستخدم النظام' : 'Staff Member')}
            </p>
            <div className="mt-1">{getRoleBadge()}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title={t('common.logout')}
          className="p-2.5 rounded-2xl text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/70 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
