import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.js';
import { LoginForm } from '../features/auth/components/LoginForm.js';
import { Sparkles, AlertCircle, ShieldCheck, Building2, Store, Pill, Coins, MapPin } from 'lucide-react';
import { PharmacyBrandLogo } from '../components/common/PharmacyBrandLogo.js';
import { cn } from '../lib/utils.js';

interface DemoAccountDef {
  key: string;
  name: string;
  roleKey: string;
  identifier: string;
  pass: string;
  icon: React.ReactNode;
  borderClass: string;
  bgClass: string;
  textClass: string;
  colSpan?: string;
}

interface DemoBranchGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  accounts: DemoAccountDef[];
}

const demoGroups: DemoBranchGroup[] = [
  {
    id: 'hq',
    title: 'الإدارة العامة (HQ)',
    icon: <Building2 className="w-3.5 h-3.5" />,
    accounts: [
      {
        key: 'PLATFORM_MANAGER',
        name: 'د. طارق المدير العام',
        roleKey: 'PLATFORM_MANAGER',
        identifier: '01012345678',
        pass: '12345678',
        icon: <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />,
        borderClass: 'border-indigo-200 hover:border-indigo-400 dark:border-indigo-900 dark:hover:border-indigo-600',
        bgClass: 'bg-indigo-50/70 hover:bg-indigo-100/80 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40',
        textClass: 'text-indigo-950 dark:text-indigo-100',
      },
      {
        key: 'PHARMACY_MANAGER',
        name: 'د. ربيع مدير عام السلسلة',
        roleKey: 'PHARMACY_MANAGER',
        identifier: '01098765432',
        pass: '12345678',
        icon: <Building2 className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />,
        borderClass: 'border-blue-200 hover:border-blue-400 dark:border-blue-900 dark:hover:border-blue-600',
        bgClass: 'bg-blue-50/70 hover:bg-blue-100/80 dark:bg-blue-950/30 dark:hover:bg-blue-900/40',
        textClass: 'text-blue-950 dark:text-blue-100',
      },
    ],
  },
  {
    id: 'dokki',
    title: 'فرع الدقي (الرئيسي)',
    icon: <MapPin className="w-3.5 h-3.5 text-sky-600" />,
    accounts: [
      {
        key: 'DOKKI_MANAGER',
        name: 'د. حسام مدير الفرع',
        roleKey: 'BRANCH_MANAGER',
        identifier: '01011110001',
        pass: '12345678',
        icon: <Store className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />,
        borderClass: 'border-teal-200 hover:border-teal-400 dark:border-teal-900 dark:hover:border-teal-600',
        bgClass: 'bg-teal-50/70 hover:bg-teal-100/80 dark:bg-teal-950/30 dark:hover:bg-teal-900/40',
        textClass: 'text-teal-950 dark:text-teal-100',
        colSpan: 'col-span-2',
      },
      {
        key: 'DOKKI_PHARMACIST',
        name: 'د. أحمد صيدلي',
        roleKey: 'PHARMACIST',
        identifier: '01111110001',
        pass: '12345678',
        icon: <Pill className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />,
        borderClass: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-900 dark:hover:border-emerald-600',
        bgClass: 'bg-emerald-50/70 hover:bg-emerald-100/80 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40',
        textClass: 'text-emerald-950 dark:text-emerald-100',
      },
      {
        key: 'DOKKI_ACCOUNTANT',
        name: 'أ. مصطفى محاسب',
        roleKey: 'ACCOUNTANT',
        identifier: '01211110001',
        pass: '12345678',
        icon: <Coins className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />,
        borderClass: 'border-amber-200 hover:border-amber-400 dark:border-amber-900 dark:hover:border-amber-600',
        bgClass: 'bg-amber-50/70 hover:bg-amber-100/80 dark:bg-amber-950/30 dark:hover:bg-amber-900/40',
        textClass: 'text-amber-950 dark:text-amber-100',
      },
    ],
  },
  {
    id: 'maadi',
    title: 'فرع المعادي',
    icon: <MapPin className="w-3.5 h-3.5 text-teal-600" />,
    accounts: [
      {
        key: 'MAADI_MANAGER',
        name: 'د. خالد مدير الفرع',
        roleKey: 'BRANCH_MANAGER',
        identifier: '01055554444',
        pass: '12345678',
        icon: <Store className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />,
        borderClass: 'border-teal-200 hover:border-teal-400 dark:border-teal-900 dark:hover:border-teal-600',
        bgClass: 'bg-teal-50/70 hover:bg-teal-100/80 dark:bg-teal-950/30 dark:hover:bg-teal-900/40',
        textClass: 'text-teal-950 dark:text-teal-100',
        colSpan: 'col-span-2',
      },
      {
        key: 'MAADI_PHARMACIST',
        name: 'د. مريم صيدلي',
        roleKey: 'PHARMACIST',
        identifier: '01123456789',
        pass: '12345678',
        icon: <Pill className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />,
        borderClass: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-900 dark:hover:border-emerald-600',
        bgClass: 'bg-emerald-50/70 hover:bg-emerald-100/80 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40',
        textClass: 'text-emerald-950 dark:text-emerald-100',
      },
      {
        key: 'MAADI_ACCOUNTANT',
        name: 'أ. هاني محاسب',
        roleKey: 'ACCOUNTANT',
        identifier: '01223456789',
        pass: '12345678',
        icon: <Coins className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />,
        borderClass: 'border-amber-200 hover:border-amber-400 dark:border-amber-900 dark:hover:border-amber-600',
        bgClass: 'bg-amber-50/70 hover:bg-amber-100/80 dark:bg-amber-950/30 dark:hover:bg-amber-900/40',
        textClass: 'text-amber-950 dark:text-amber-100',
      },
    ],
  },
  {
    id: 'nasr',
    title: 'فرع مدينة نصر',
    icon: <MapPin className="w-3.5 h-3.5 text-indigo-600" />,
    accounts: [
      {
        key: 'NASR_MANAGER',
        name: 'د. عمرو مدير الفرع',
        roleKey: 'BRANCH_MANAGER',
        identifier: '01033330003',
        pass: '12345678',
        icon: <Store className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />,
        borderClass: 'border-teal-200 hover:border-teal-400 dark:border-teal-900 dark:hover:border-teal-600',
        bgClass: 'bg-teal-50/70 hover:bg-teal-100/80 dark:bg-teal-950/30 dark:hover:bg-teal-900/40',
        textClass: 'text-teal-950 dark:text-teal-100',
        colSpan: 'col-span-2',
      },
      {
        key: 'NASR_PHARMACIST',
        name: 'د. نور صيدلي',
        roleKey: 'PHARMACIST',
        identifier: '01133330003',
        pass: '12345678',
        icon: <Pill className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />,
        borderClass: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-900 dark:hover:border-emerald-600',
        bgClass: 'bg-emerald-50/70 hover:bg-emerald-100/80 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40',
        textClass: 'text-emerald-950 dark:text-emerald-100',
      },
      {
        key: 'NASR_ACCOUNTANT',
        name: 'أ. كريم محاسب',
        roleKey: 'ACCOUNTANT',
        identifier: '01233330003',
        pass: '12345678',
        icon: <Coins className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />,
        borderClass: 'border-amber-200 hover:border-amber-400 dark:border-amber-900 dark:hover:border-amber-600',
        bgClass: 'bg-amber-50/70 hover:bg-amber-100/80 dark:bg-amber-950/30 dark:hover:bg-amber-900/40',
        textClass: 'text-amber-950 dark:text-amber-100',
      },
    ],
  },
];

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { sessionExpired } = useAppSelector((state) => state.auth);
  const { publicSettings } = useAppSelector((state) => state.settings);
  const [activeTab, setActiveTab] = useState<string>('hq');
  const [selectedAccountKey, setSelectedAccountKey] = useState<string>('PLATFORM_MANAGER');

  const handleQuickFill = (acc: DemoAccountDef) => {
    setSelectedAccountKey(acc.key);
    const btn = document.getElementById('btn-quick-fill') as HTMLButtonElement | null;
    if (btn) {
      btn.dataset.id = acc.identifier;
      btn.dataset.pass = acc.pass;
      btn.click();
    }
  };

  const currentGroup = demoGroups.find((g) => g.id === activeTab) || demoGroups[0];

  return (
    <div className="min-h-screen bg-[#F0F6FA] dark:bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Blur Circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-200/40 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-200/40 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10">
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

            {/* Quick Demo Multi-Branch Accounts Switcher */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#1E293B]">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{t('auth.quickDemo')} (اختر الفرع والدور للتعبئة)</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  كلمة المرور الموحدة: 12345678
                </span>
              </div>

              {/* Branch Selection Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0B0F17] rounded-xl mb-3 overflow-x-auto">
                {demoGroups.map((grp) => {
                  const isActive = activeTab === grp.id;
                  return (
                    <button
                      key={grp.id}
                      type="button"
                      onClick={() => setActiveTab(grp.id)}
                      className={cn(
                        'flex-1 min-w-max px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                        isActive
                          ? 'bg-white dark:bg-[#1E293B] text-sky-700 dark:text-sky-300 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      )}
                    >
                      {grp.icon}
                      <span>{grp.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Account Cards Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {currentGroup.accounts.map((acc) => {
                  const isSelected = selectedAccountKey === acc.key;
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
                          ? 'ring-2 ring-sky-500/60 dark:ring-sky-400/60 shadow-sm scale-[1.01]'
                          : 'opacity-85 hover:opacity-100'
                      )}
                    >
                      {acc.icon}
                      <div className="min-w-0 flex-1">
                        <div className="font-bold truncate text-[11px] sm:text-xs">
                          {acc.name}
                        </div>
                        <div className="text-[10px] opacity-70 font-mono truncate flex items-center justify-between">
                          <span>{t(`roles.${acc.roleKey}`)}</span>
                          <span className="font-bold">{acc.identifier}</span>
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
