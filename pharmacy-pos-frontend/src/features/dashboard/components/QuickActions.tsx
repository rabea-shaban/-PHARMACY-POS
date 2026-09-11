import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { useAppSelector } from '../../../store/hooks.js';
import {
  ShoppingCart,
  Pill,
  Truck,
  Wallet,
  Coins,
  FileSpreadsheet,
  Zap,
  Store,
  LayoutGrid,
  ArrowLeftRight,
  Landmark,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Role } from '../../../types/auth.types.js';

interface QuickActionItem {
  titleKey: string;
  href: string;
  icon: React.ReactNode;
  roles: Role[];
  color: string;
}

const actionsList: QuickActionItem[] = [
  {
    titleKey: 'dashboard.actionNewSale',
    href: '/pos',
    icon: <ShoppingCart className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'BRANCH_MANAGER', 'PHARMACIST'],
    color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
  {
    titleKey: 'dashboard.actionBranches',
    href: '/branches',
    icon: <Store className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'],
    color: 'bg-teal-50 text-teal-600 hover:bg-teal-100 dark:bg-teal-950/50 dark:text-teal-300',
  },
  {
    titleKey: 'dashboard.actionMatrix',
    href: '/inventory/matrix',
    icon: <LayoutGrid className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'BRANCH_MANAGER'],
    color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300',
  },
  {
    titleKey: 'dashboard.actionTransfers',
    href: '/transfers',
    icon: <ArrowLeftRight className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'BRANCH_MANAGER', 'PHARMACIST'],
    color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300',
  },
  {
    titleKey: 'dashboard.actionFinance',
    href: '/finance',
    icon: <Landmark className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
    color: 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300',
  },
  {
    titleKey: 'dashboard.actionAddExpense',
    href: '/expenses/new',
    icon: <Wallet className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'BRANCH_MANAGER', 'ACCOUNTANT'],
    color: 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300',
  },
  {
    titleKey: 'dashboard.actionPayroll',
    href: '/payroll',
    icon: <Coins className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
    color: 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-300',
  },
  {
    titleKey: 'dashboard.actionReceivePurchase',
    href: '/purchases/new',
    icon: <Truck className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'BRANCH_MANAGER', 'ACCOUNTANT'],
    color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100 dark:bg-cyan-950/50 dark:text-cyan-300',
  },
  {
    titleKey: 'dashboard.actionAddProduct',
    href: '/products/new',
    icon: <Pill className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'BRANCH_MANAGER', 'PHARMACIST'],
    color: 'bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-300',
  },
  {
    titleKey: 'dashboard.actionUsers',
    href: '/users',
    icon: <UsersRound className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'BRANCH_MANAGER'],
    color: 'bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-950/50 dark:text-violet-300',
  },
  {
    titleKey: 'dashboard.actionReports',
    href: '/reports',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'BRANCH_MANAGER', 'ACCOUNTANT'],
    color: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200',
  },
  {
    titleKey: 'dashboard.actionAudit',
    href: '/audit',
    icon: <ShieldCheck className="w-5 h-5" />,
    roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'],
    color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
];

export const QuickActions: React.FC = () => {
  const { t } = useTranslation();
  const { role } = useAppSelector((state) => state.auth);

  const availableActions = actionsList.filter((a) => {
    if (!role) return false;
    return a.roles.includes(role);
  });

  return (
    <Card className="rounded-3xl shadow-xs">
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <CardTitle className="text-base">{t('dashboard.quickActionsTitle')}</CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('dashboard.quickActionsSubtitle')}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {availableActions.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-[#223049] transition-all text-center space-y-2 group cursor-pointer ${action.color}`}
            >
              <div className="p-2 rounded-xl bg-white/70 dark:bg-black/20 group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <span className="text-xs font-bold leading-tight">
                {t(action.titleKey)}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
