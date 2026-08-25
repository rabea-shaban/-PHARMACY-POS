import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { toggleSidebar, setTheme } from '../../store/slices/uiSlice.js';
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
        return <Badge variant="mint">صيدلي</Badge>;
      case 'ACCOUNTANT':
        return <Badge variant="info">محاسب</Badge>;
      default:
        return null;
    }
  };

  return (
    <header className="h-16 bg-[#F7FCFC] dark:bg-[#0E2C2E] border-b border-[#D5E6E5] dark:border-[#183C3E] px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left side: Hamburger Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-2xl text-[#557274] hover:bg-[#DDEEEE] hover:text-[#003C3D] transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right side: Notifications, Theme, User Avatar, Logout */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))}
          className="p-2 rounded-2xl text-[#557274] hover:bg-[#DDEEEE] hover:text-[#003C3D] transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Notifications Icon */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-2xl text-[#557274] hover:bg-[#DDEEEE] hover:text-[#003C3D] transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F2A9AB] text-[#713F42] text-[9px] font-bold">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-[#D5E6E5] dark:bg-[#183C3E] mx-1" />

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#DDEEEE] text-[#003C3D] flex items-center justify-center font-bold text-sm">
            <UserIcon className="w-5 h-5" />
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-[#0B3031] dark:text-[#F2FBFA] leading-none">
              {user?.name || 'مستخدم النظام'}
            </p>
            <div className="mt-1">{getRoleBadge()}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="تسجيل الخروج"
          className="p-2 rounded-2xl text-[#713F42] bg-[#FDEEEF] hover:bg-[#F2A9AB] transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
