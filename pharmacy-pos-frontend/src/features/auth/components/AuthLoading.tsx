import React from 'react';
import { HeartPulse } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AuthLoading: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#F0F6FA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans p-6">
      <div className="relative flex flex-col items-center space-y-4">
        {/* Animated Brand Pulse Icon */}
        <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-teal-400 text-white flex items-center justify-center shadow-xl shadow-sky-500/25 animate-bounce duration-1000">
          <HeartPulse className="w-9 h-9 text-white" strokeWidth={2.5} />
        </div>

        {/* Brand Name & Loading Message */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            {t('common.pharmacyName')}
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
            {t('common.loading')}
          </p>
        </div>
      </div>
    </div>
  );
};
