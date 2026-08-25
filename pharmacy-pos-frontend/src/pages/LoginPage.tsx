import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.js';
import { LoginForm } from '../features/auth/components/LoginForm.js';
import { Sparkles, HeartPulse, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { sessionExpired } = useAppSelector((state) => state.auth);

  const handleQuickFill = (identifier: string, pass: string) => {
    const btn = document.getElementById('btn-quick-fill') as HTMLButtonElement | null;
    if (btn) {
      btn.dataset.id = identifier;
      btn.dataset.pass = pass;
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
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-teal-400 text-white items-center justify-center shadow-xl shadow-sky-500/25">
            <HeartPulse className="w-9 h-9 text-white animate-pulse" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('common.pharmacyName')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('common.posAndManagement')}
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
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>{t('auth.quickDemo')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickFill('01012345678', 'AdminPass123!')}
                  className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 dark:bg-[#1E293B] dark:text-slate-200 text-center font-bold transition-colors cursor-pointer"
                >
                  {t('roles.PLATFORM_MANAGER')}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('01123456789', 'PharmPass123!')}
                  className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 dark:bg-[#1E293B] dark:text-slate-200 text-center font-bold transition-colors cursor-pointer"
                >
                  {t('roles.PHARMACIST')}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('01223456789', 'AccPass123!')}
                  className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 dark:bg-[#1E293B] dark:text-slate-200 text-center font-bold transition-colors cursor-pointer"
                >
                  {t('roles.ACCOUNTANT')}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
