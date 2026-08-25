import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { toggleSidebar, toggleTheme, toggleLanguage } from '../../store/slices/uiSlice.js';
import { setUnreadCount } from '../../store/slices/notificationSlice.js';
import { api } from '../../lib/api.js';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Languages,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlobalSearch } from '../common/GlobalSearch.js';
import { UserMenu } from './UserMenu.js';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { theme, language } = useAppSelector((state) => state.ui);
  const { unreadCount } = useAppSelector((state) => state.notifications);

  // Fetch live unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/notifications/unread-count');
        if (typeof response.data.data?.unreadCount === 'number') {
          dispatch(setUnreadCount(response.data.data.unreadCount));
        }
      } catch {
        // Ignore if notification server endpoint not triggered yet
      }
    };
    fetchUnreadCount();
  }, [dispatch]);

  return (
    <header className="h-16 bg-white dark:bg-[#0E1522] border-b border-slate-200/80 dark:border-[#1E293B] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors">
      {/* Left side: Hamburger Toggle & Global Search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className="p-2.5 rounded-2xl text-slate-600 hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-[#1A2639] dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <GlobalSearch />
      </div>

      {/* Right side: Language, Theme, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-2.5">
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
          title={t('nav.notifications')}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-white text-[9px] font-bold">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-[#1E293B] mx-1 hidden sm:block" />

        {/* User Dropdown Menu */}
        <UserMenu />
      </div>
    </header>
  );
};
