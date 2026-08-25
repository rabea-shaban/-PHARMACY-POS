import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import { User as UserIcon, LogOut, Settings, Shield, ChevronDown } from 'lucide-react';
import { Badge } from '../ui/Badge.js';
import { Link } from 'react-router-dom';

export const UserMenu: React.FC = () => {
  const { t } = useTranslation();
  const { user, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-[#1A2639] transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center font-bold text-sm shrink-0">
          <UserIcon className="w-5 h-5" />
        </div>
        <div className="hidden md:block text-start leading-none">
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {user?.name || 'مستخدم النظام'}
          </p>
          <div className="mt-1">{getRoleBadge()}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute end-0 mt-2 w-60 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
          {/* User Details */}
          <div className="p-3 border-b border-slate-100 dark:border-[#1E293B]">
            <p className="font-bold text-xs text-slate-900 dark:text-white">
              {user?.name || 'مستخدم النظام'}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
              {user?.phone || user?.email || ''}
            </p>
          </div>

          <div className="py-1 space-y-0.5 text-xs font-medium text-slate-700 dark:text-slate-200">
            {role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role) && (
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1C273B] transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>{t('nav.settings')}</span>
              </Link>
            )}

            {role === 'PLATFORM_MANAGER' && (
              <Link
                to="/audit"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1C273B] transition-colors"
              >
                <Shield className="w-4 h-4 text-slate-400" />
                <span>{t('nav.audit')}</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-start cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('common.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
