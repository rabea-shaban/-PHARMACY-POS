import React from 'react';
import { useTranslation } from 'react-i18next';
import { AuditLog } from '../types/audit.types.js';
import { AuditActionBadge } from './AuditActionBadge.js';
import { formatDate } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export interface AuditTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  onSelectLog: (log: AuditLog) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export const AuditTable: React.FC<AuditTableProps> = ({
  logs,
  isLoading,
  onSelectLog,
  pagination,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const { direction } = useAppSelector((state) => state.ui);

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
              <th className="py-3.5 px-4 text-start">التاريخ والوقت</th>
              <th className="py-3.5 px-4 text-start">المستخدم المسؤول</th>
              <th className="py-3.5 px-4 text-start">العملية / الإجراء</th>
              <th className="py-3.5 px-4 text-start">الكيان / المورد (Entity)</th>
              <th className="py-3.5 px-4 text-start">معرف الكيان</th>
              <th className="py-3.5 px-4 text-end">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors"
              >
                {/* Timestamp */}
                <td className="py-3.5 px-4 text-slate-500 font-mono">
                  {formatDate(log.createdAt)}
                </td>

                {/* Actor */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <UserIcon className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>{log.userName || 'نظام آلي (System)'}</span>
                  </div>
                  {log.userRole && (
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {log.userRole}
                    </span>
                  )}
                </td>

                {/* Action */}
                <td className="py-3.5 px-4">
                  <AuditActionBadge action={log.action} />
                </td>

                {/* Entity */}
                <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 font-mono">
                  {log.entity}
                </td>

                {/* Entity ID */}
                <td className="py-3.5 px-4 font-mono text-slate-500">
                  {log.entityId ? (
                    <span className="bg-slate-100 dark:bg-[#0B0F17] px-2 py-0.5 rounded text-[11px]">
                      #{log.entityId.slice(0, 8)}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-end">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectLog(log)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 transition-colors cursor-pointer"
                      title="عرض التفاصيل والفروقات"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      to={`/audit/${log.id}`}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-slate-500 dark:text-slate-400 transition-colors"
                      title="فتح صفحة السجل"
                    >
                      <span className="text-[10px] font-bold">صفحة</span>
                    </Link>
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
