import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.js';
import { LoginForm } from '../features/auth/components/LoginForm.js';
import { Sparkles, AlertCircle, ShieldCheck, Building2, Store, Pill, Coins } from 'lucide-react';
import { PharmacyBrandLogo } from '../components/common/PharmacyBrandLogo.js';
import { cn } from '../lib/utils.js';

interface DemoAccountDef {
  key: string;
  identifier: string;
  pass: string;
  icon: React.ReactNode;
  borderClass: string;
  bgClass: string;
  textClass: string;
  colSpan?: string;
}

const demoAccounts: DemoAccountDef[] = [
  {
    key: 'PLATFORM_MANAGER',
    identifier: '01012345678',
    pass: 'AdminPass123!',
    icon: <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />,
    borderClass: 'border-indigo-200 hover:border-indigo-400 dark:border-indigo-900 dark:hover:border-indigo-600',
    bgClass: 'bg-indigo-50/70 hover:bg-indigo-100/80 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40',
    textClass: 'text-indigo-950 dark:text-indigo-100',
    colSpan: 'col-span-2',
  },
  {
    key: 'PHARMACY_MANAGER',
    identifier: '01098765432',
    pass: 'ManagerPass123!',
    icon: <Building2 className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />,
    borderClass: 'border-blue-200 hover:border-blue-400 dark:border-blue-900 dark:hover:border-blue-600',
    bgClass: 'bg-blue-50/70 hover:bg-blue-100/80 dark:bg-blue-950/30 dark:hover:bg-blue-900/40',
    textClass: 'text-blue-950 dark:text-blue-100',
  },
  {
    key: 'BRANCH_MANAGER',
    identifier: '01055554444',
    pass: 'BranchPass123!',
    icon: <Store className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />,
    borderClass: 'border-teal-200 hover:border-teal-400 dark:border-teal-900 dark:hover:border-teal-600',
    bgClass: 'bg-teal-50/70 hover:bg-teal-100/80 dark:bg-teal-950/30 dark:hover:bg-teal-900/40',
    textClass: 'text-teal-950 dark:text-teal-100',
  },
  {
    key: 'PHARMACIST',
    identifier: '01123456789',
    pass: 'PharmPass123!',
    icon: <Pill className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />,
    borderClass: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-900 dark:hover:border-emerald-600',
    bgClass: 'bg-emerald-50/70 hover:bg-emerald-100/80 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40',
    textClass: 'text-emerald-950 dark:text-emerald-100',
  },
  {
    key: 'ACCOUNTANT',
    identifier: '01223456789',
    pass: 'AccPass123!',
    icon: <Coins className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />,
    borderClass: 'border-amber-200 hover:border-amber-400 dark:border-amber-900 dark:hover:border-amber-600',
    bgClass: 'bg-amber-50/70 hover:bg-amber-100/80 dark:bg-amber-950/30 dark:hover:bg-amber-900/40',
    textClass: 'text-amber-950 dark:text-amber-100',
  },
];

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { sessionExpired } = useAppSelector((state) => state.auth);
  const { publicSettings } = useAppSelector((state) => state.settings);
  const [selectedRole, setSelectedRole] = useState<string>('PLATFORM_MANAGER');

  const handleQuickFill = (acc: DemoAccountDef) => {
    setSelectedRole(acc.key);
    const btn = document.getElementById('btn-quick-fill') as HTMLButtonElement | null;
    if (btn) {
      btn.dataset.id = acc.identifier;
      btn.dataset.pass = acc.pass;
      btn.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F6FA] dark:bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Blur Circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-200/40 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-200/40 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <PharmacyBrandLogo size="xl" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {publicSettings.pharmacyName || t('common.pharmacyName')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {publicSettings.pharmacySlogan || t('common.posAndManagement')}
          </p>
        </div>

        {/* Session Expired Notice */}
        {sessionExpired && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 text-xs font-bold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{t('auth.sessionExpiredNotice')}</span>
          </div>
        )}

        {/* Login Card */}
        <Card className="border-slate-200/80 dark:border-[#223049] bg-white dark:bg-[#131B2A] shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-lg">
              {t('auth.loginTitle')}
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              {t('auth.loginSubtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* React Hook Form + Zod Form */}
            <LoginForm />

            {/* Quick Demo Accounts Presets */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#1E293B]">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{t('auth.quickDemo')}</span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  (اختر الحساب للتعبئة الفورية)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {demoAccounts.map((acc) => {
                  const isSelected = selectedRole === acc.key;
                  return (
                    <button
                      key={acc.key}
                      type="button"
                      onClick={() => handleQuickFill(acc)}
                      className={cn(
                        'p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer text-start flex items-center gap-2.5',
                        acc.borderClass,
                        acc.bgClass,
                        acc.textClass,
                        acc.colSpan,
                        isSelected
                          ? 'ring-2 ring-sky-500/50 dark:ring-sky-400/50 shadow-sm'
                          : 'opacity-85 hover:opacity-100'
                      )}
                    >
                      {acc.icon}
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate text-[11px] sm:text-xs">
                          {t(`roles.${acc.key}`)}
                        </div>
                        <div className="text-[10px] opacity-70 font-mono truncate">
                          {acc.identifier}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
