import React from 'react';
import { AuditAction } from '../types/audit.types.js';
import {
  PlusCircle,
  Edit,
  Trash2,
  LogIn,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  Boxes,
} from 'lucide-react';

export interface AuditActionBadgeProps {
  action: AuditAction;
}

export const AuditActionBadge: React.FC<AuditActionBadgeProps> = ({ action }) => {
  switch (action) {
    case 'CREATE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <PlusCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>إنشاء وإضافة (CREATE)</span>
        </span>
      );
    case 'UPDATE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <Edit className="w-3 h-3 text-sky-600 dark:text-sky-400" />
          <span>تعديل وتحديث (UPDATE)</span>
        </span>
      );
    case 'DELETE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <Trash2 className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>حذف / إلغاء (DELETE)</span>
        </span>
      );
    case 'LOGIN':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <LogIn className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          <span>تسجيل دخول (LOGIN)</span>
        </span>
      );
    case 'SALE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
          <ShoppingBag className="w-3 h-3 text-teal-600 dark:text-teal-400" />
          <span>فاتورة بيع (SALE)</span>
        </span>
      );
    case 'PAYMENT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <CreditCard className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>حركة دفع (PAYMENT)</span>
        </span>
      );
    case 'RETURN':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
          <RotateCcw className="w-3 h-3 text-violet-600 dark:text-violet-400" />
          <span>مرتجع مبيعات (RETURN)</span>
        </span>
      );
    case 'INVENTORY_ADJUSTMENT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
          <Boxes className="w-3 h-3 text-orange-600 dark:text-orange-400" />
          <span>تسوية مخزون (ADJUST)</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          <span>{action}</span>
        </span>
      );
  }
};
