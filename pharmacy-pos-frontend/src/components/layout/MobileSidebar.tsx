import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { toggleSidebar } from '../../store/slices/uiSlice.js';
import {
  LayoutDashboard,
  ShoppingCart,
  Pill,
  Boxes,
  Truck,
  Users,
  Receipt,
  RotateCcw,
  Wallet,
  Coins,
  FileSpreadsheet,
  BellRing,
  ShieldCheck,
  Settings,
  UsersRound,
  HeartPulse,
  Tag,
  Building2,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { Role } from '../../types/auth.types.js';

interface NavItemDef {
  key: string;
  href: string;
  icon: React.ReactNode;
  roles?: Role[];
}

const navItemDefs: NavItemDef[] = [
  {
    key: 'pos',
    href: '/pos',
    icon: <ShoppingCart className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'],
  },
  {
    key: 'dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  {
    key: 'products',
    href: '/products',
    icon: <Pill className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    key: 'categories',
    href: '/categories',
    icon: <Tag className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    key: 'inventory',
    href: '/inventory',
    icon: <Boxes className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    key: 'suppliers',
    href: '/suppliers',
    icon: <Building2 className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    key: 'purchases',
    href: '/purchases',
    icon: <Truck className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    key: 'customers',
    href: '/customers',
    icon: <Users className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    key: 'sales',
    href: '/sales',
    icon: <Receipt className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    key: 'returns',
    href: '/returns',
    icon: <RotateCcw className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'],
  },
  {
    key: 'expenses',
    href: '/expenses',
    icon: <Wallet className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  {
    key: 'payroll',
    href: '/payroll',
    icon: <Coins className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  {
    key: 'reports',
    href: '/reports',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  {
    key: 'notifications',
    href: '/notifications',
    icon: <BellRing className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    key: 'audit',
    href: '/audit',
    icon: <ShieldCheck className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'],
  },
  {
    key: 'settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  {
    key: 'users',
    href: '/users',
    icon: <UsersRound className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'],
  },
];

export const MobileSidebar: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { sidebarOpen, direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  if (!sidebarOpen) return null;

  const filteredItems = navItemDefs.filter((item) => {
    if (!item.roles) return true;
    return role && item.roles.includes(role);
  });

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* Drawer Panel */}
      <aside
        className={cn(
          'relative z-50 w-72 h-full bg-white dark:bg-[#0E1522] border-slate-200 dark:border-[#1E293B] shadow-2xl flex flex-col',
          direction === 'rtl' ? 'mr-auto border-l' : 'ml-auto border-r'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200/80 dark:border-[#1E293B] shrink-0 bg-[#F4F9FC] dark:bg-[#0B0F17]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-sky-500/25 shrink-0">
              <HeartPulse className="w-5 h-5 text-white animate-pulse" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('common.pharmacyName')}
              </h2>
              <p className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase">
                {t('common.posAndManagement')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {filteredItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => dispatch(toggleSidebar())}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/25 dark:bg-sky-500 dark:text-slate-950'
                    : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#1A2639]'
                )
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{t(`nav.${item.key}`)}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
};
