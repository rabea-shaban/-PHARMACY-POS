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
        'fixed top-0 right-0 z-40 h-screen bg-slate-900 text-white border-l border-slate-800 transition-all duration-300 flex flex-col',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/20 shrink-0">
            🏥
          </div>
          {sidebarOpen && (
            <div className="truncate">
              <h2 className="text-sm font-bold tracking-tight text-white">صيدلية الأمل</h2>
              <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                POS & Management
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              )
            }
          >
            <span className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</span>
            {sidebarOpen && <span className="truncate">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer / POS Quick Launch */}
      {sidebarOpen && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>الإصدار</span>
            <span className="font-mono font-semibold text-emerald-400">v1.0.0 Pro</span>
          </div>
        </div>
      )}
    </aside>
  );
};
