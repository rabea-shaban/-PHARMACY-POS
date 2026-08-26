import { Role } from '../../../types/auth.types.js';
import { ShieldCheck, UserCheck, Stethoscope, Calculator } from 'lucide-react';

export interface UserRoleBadgeProps {
  role: Role;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role }) => {
  switch (role) {
    case 'PLATFORM_MANAGER':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs">
          <ShieldCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          <span>مدير منصة (Super Admin)</span>
        </span>
      );
    case 'PHARMACY_MANAGER':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <UserCheck className="w-3 h-3 text-sky-600 dark:text-sky-400" />
          <span>مدير الصيدلية</span>
        </span>
      );
    case 'PHARMACIST':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Stethoscope className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>دكتور صيدلي (كاشير)</span>
        </span>
      );
    case 'ACCOUNTANT':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Calculator className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>محاسب مالي</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          <span>{role}</span>
        </span>
      );
  }
};
