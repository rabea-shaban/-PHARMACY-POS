import React from 'react';
import { ExpenseCategory } from '../types/expense.types.js';
import { Building2, Zap, Wrench, Package, UserCheck, HelpCircle } from 'lucide-react';

export interface ExpenseCategoryBadgeProps {
  category: ExpenseCategory;
}

export const ExpenseCategoryBadge: React.FC<ExpenseCategoryBadgeProps> = ({ category }) => {
  switch (category) {
    case 'RENT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Building2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>إيجار الصيدلية</span>
        </span>
      );
    case 'ELECTRICITY':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
          <Zap className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
          <span>كهرباء ومرافق</span>
        </span>
      );
    case 'MAINTENANCE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <Wrench className="w-3 h-3 text-sky-600 dark:text-sky-400" />
          <span>صيانة وتصليحات</span>
        </span>
      );
    case 'SUPPLIES':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Package className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>أدوات ومستلزمات</span>
        </span>
      );
    case 'SALARY':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          <UserCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          <span>رواتب وعمالة</span>
        </span>
      );
    case 'OTHER':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
          <HelpCircle className="w-3 h-3 text-slate-500" />
          <span>نثريات ومصروفات عامة</span>
        </span>
      );
  }
};
