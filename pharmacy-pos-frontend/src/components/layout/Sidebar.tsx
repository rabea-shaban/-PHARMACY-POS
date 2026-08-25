import React from 'react';
import { NavLink } from 'react-router-dom';
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
  Coins,
  FileSpreadsheet,
  BellRing,
  ShieldCheck,
  Settings,
  UsersRound,
  HeartPulse,
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { Role } from '../../types/auth.types.js';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: Role[];
}

const navItems: NavItem[] = [
  {
    title: 'نقطة البيع (POS)',
    href: '/pos',
    icon: <ShoppingCart className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'],
  },
  {
    title: 'لوحة التحكم (Dashboard)',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  {
    title: 'الأدوية والأصناف',
    href: '/products',
    icon: <Pill className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    title: 'المخزون والتشغيلات (FEFO)',
    href: '/inventory',
    icon: <Boxes className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    title: 'الموردين والمشتريات',
    href: '/purchases',
    icon: <Truck className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  {
    title: 'العملاء والولاء',
    href: '/customers',
    icon: <Users className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    title: 'فواتير المبيعات',
    href: '/sales',
    icon: <Receipt className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    title: 'المرتجعات والاسترداد',
    href: '/returns',
    icon: <RotateCcw className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'],
  },
  {
    title: 'المصروفات والعمولات',
    href: '/expenses',
    icon: <Wallet className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  {
    title: 'مسيرات الرواتب (Payroll)',
    href: '/payroll',
    icon: <Coins className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  {
    title: 'التقارير والتحليلات',
    href: '/reports',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  {
    title: 'التنبيهات و WhatsApp',
    href: '/notifications',
    icon: <BellRing className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  {
    title: 'سجلات التدقيق والأمان',
    href: '/audit',
    icon: <ShieldCheck className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'],
  },
  {
    title: 'إعدادات النظام',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  {
    title: 'إدارة الموظفين والصلاحيات',
    href: '/users',
    icon: <UsersRound className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'],
  },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return role && item.roles.includes(role);
  });

  return (
    <aside
      className={cn(
        'fixed top-0 right-0 z-40 h-screen transition-all duration-300 flex flex-col',
        'bg-white border-l border-slate-200/80 shadow-xs',
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
                صيدلية الأمل
              </h2>
              <p className="text-[10px] text-sky-600 dark:text-sky-400 font-bold tracking-wider uppercase">
                POS & Management
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
            {sidebarOpen && <span className="truncate">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer Version */}
      {sidebarOpen && (
        <div className="p-4 border-t border-slate-200/80 dark:border-[#1E293B] bg-[#F4F9FC] dark:bg-[#0B0F17]/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>نظام الصيدلية</span>
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400">v1.0 Pro</span>
          </div>
        </div>
      )}
    </aside>
  );
};
