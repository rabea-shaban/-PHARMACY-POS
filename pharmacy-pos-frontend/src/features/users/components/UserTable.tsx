import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../types/user.types.js';
import { UserRoleBadge } from './UserRoleBadge.js';
import { UserStatusBadge } from './UserStatusBadge.js';
import { formatDate } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';
import { Eye, Edit, UserX, UserCheck, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onToggleStatus?: (user: User) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  onToggleStatus,
  pagination,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const { direction } = useAppSelector((state) => state.ui);
  const { user: currentUser, role } = useAppSelector((state) => state.auth);

  const canManage = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] p-6 space-y-4 shadow-xs">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
            <tr>
              <th className="py-3.5 px-4 text-start">الموظف / المستخدم</th>
              <th className="py-3.5 px-4 text-start">رقم الهاتف</th>
              <th className="py-3.5 px-4 text-start">الصلاحية / الدور</th>
              <th className="py-3.5 px-4 text-start">حالة الحساب</th>
              <th className="py-3.5 px-4 text-start">تاريخ الإنشاء</th>
              <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
            {users.map((u: User) => (
              <tr
                key={u.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
              >
                {/* User Name & Email */}
                <td className="py-3.5 px-4">
                  <Link
                    to={`/users/${u.id}`}
                    className="font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors block"
                  >
                    {u.name}
                    {currentUser?.id === u.id && (
                      <span className="ms-1.5 px-1.5 py-0.5 rounded text-[10px] bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold">
                        (أنت)
                      </span>
                    )}
                  </Link>
                  {u.email && (
                    <span className="text-[11px] text-slate-400 block">{u.email}</span>
                  )}
                </td>

                {/* Phone */}
                <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.phone}</span>
                  </div>
                </td>

                {/* Role */}
                <td className="py-3.5 px-4">
                  <UserRoleBadge role={u.role} />
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <UserStatusBadge isActive={u.isActive} />
                </td>

                {/* Created At */}
                <td className="py-3.5 px-4 text-slate-500 font-mono">
                  {formatDate(u.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-end">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/users/${u.id}`}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 transition-colors"
                      title={t('common.view')}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    {canManage && (
                      <>
                        <Link
                          to={`/users/${u.id}/edit`}
                          className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-600 dark:text-slate-300 transition-colors"
                          title={t('common.edit')}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {onToggleStatus && currentUser?.id !== u.id && (
                          <button
                            type="button"
                            onClick={() => onToggleStatus(u)}
                            className={`p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] transition-colors cursor-pointer ${
                              u.isActive
                                ? 'hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                                : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                            }`}
                            title={u.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                          >
                            {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0B0F17]/40">
          <p className="text-xs text-slate-500">
            {t('common.showing')} {(pagination.page - 1) * pagination.limit + 1} -{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} {t('common.of')} {pagination.total}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] disabled:opacity-40 hover:bg-white transition-colors cursor-pointer"
            >
              {direction === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <span className="px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#223049] disabled:opacity-40 hover:bg-white transition-colors cursor-pointer"
            >
              {direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
