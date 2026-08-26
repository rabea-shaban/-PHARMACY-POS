import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../store/hooks.js';
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
  Landmark,
  CreditCard,
  Coins,
  FileSpreadsheet,
  BellRing,
  ShieldCheck,
  Settings,
  UsersRound,
  HeartPulse,
  Tag,
  Building2,
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
    key: 'payments',
    href: '/payments',
    icon: <CreditCard className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT', 'PHARMACIST'],
  },
  {
    key: 'expenses',
    href: '/expenses',
    icon: <Wallet className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  {
    key: 'finance',
    href: '/finance',
    icon: <Landmark className="w-5 h-5" />,
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

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { sidebarOpen, direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  const filteredItems = navItemDefs.filter((item) => {
    if (!item.roles) return true;
    return role && item.roles.includes(role);
  });

  return (
    <aside
      className={cn(
        'fixed top-0 z-40 h-screen transition-all duration-300 flex flex-col',
        direction === 'rtl' ? 'right-0 border-l' : 'left-0 border-r',
        'bg-white border-slate-200/80 shadow-xs',
        'dark:bg-[#0E1522] dark:border-[#1E293B]',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200/80 dark:border-[#1E293B] shrink-0 bg-[#F4F9FC] dark:bg-[#0B0F17]/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-sky-500/25 shrink-0">
            <HeartPulse className="w-5 h-5 text-white animate-pulse" strokeWidth={2.5} />
          </div>
          {sidebarOpen && (
            <div className="truncate">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                {t('common.pharmacyName')}
              </h2>
              <p className="text-[10px] text-sky-600 dark:text-sky-400 font-bold tracking-wider uppercase">
                {t('common.posAndManagement')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {filteredItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/25 dark:bg-sky-500 dark:text-slate-950 dark:shadow-sky-500/20'
                  : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#1A2639]'
              )
            }
          >
            <span className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</span>
            {sidebarOpen && <span className="truncate">{t(`nav.${item.key}`)}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer Version */}
      {sidebarOpen && (
        <div className="p-4 border-t border-slate-200/80 dark:border-[#1E293B] bg-[#F4F9FC] dark:bg-[#0B0F17]/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t('common.pharmacyName')}</span>
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{t('common.version')}</span>
          </div>
        </div>
      )}
    </aside>
  );
};
