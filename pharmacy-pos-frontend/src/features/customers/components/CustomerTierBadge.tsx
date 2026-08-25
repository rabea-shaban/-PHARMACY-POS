import React from 'react';
import { CustomerTier } from '../types/customer.types.js';
import { Award, ShieldCheck, Crown, Sparkles } from 'lucide-react';

export interface CustomerTierBadgeProps {
  tier?: CustomerTier | null;
}

export const CustomerTierBadge: React.FC<CustomerTierBadgeProps> = ({ tier }) => {
  if (!tier) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        <Sparkles className="w-3 h-3 text-slate-400" />
        <span>عميل عام</span>
      </span>
    );
  }

  const nameUpper = tier.name.toUpperCase();

  if (nameUpper.includes('PLATINUM') || nameUpper.includes('بلاتيني')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs">
        <Crown className="w-3 h-3 text-purple-600 dark:text-purple-400" />
        <span>{tier.name}</span>
      </span>
    );
  }

  if (nameUpper.includes('GOLD') || nameUpper.includes('ذهبي')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs">
        <Award className="w-3 h-3 text-amber-600 dark:text-amber-400" />
        <span>{tier.name}</span>
      </span>
    );
  }

  if (nameUpper.includes('SILVER') || nameUpper.includes('فضي')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600">
        <ShieldCheck className="w-3 h-3 text-slate-600 dark:text-slate-300" />
        <span>{tier.name}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
      <Award className="w-3 h-3 text-orange-600 dark:text-orange-400" />
      <span>{tier.name}</span>
    </span>
  );
};
