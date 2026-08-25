import React from 'react';
import { useAppSelector } from '../../store/hooks.js';
import { Role } from '../../types/auth.types.js';
import { ShieldAlert } from 'lucide-react';

export interface RoleGuardProps {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ roles, children, fallback }) => {
  const { role } = useAppSelector((state) => state.auth);

  if (!role || !roles.includes(role)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 my-6 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">غير مصرح بالوصول</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
          عفواً، حسابك لا يمتلك الصلاحيات الكافية للوصول إلى هذه الشاشة أو تنفيذ هذه العملية.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
