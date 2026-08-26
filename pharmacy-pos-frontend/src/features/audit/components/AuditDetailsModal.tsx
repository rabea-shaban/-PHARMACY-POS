import React from 'react';
import { useTranslation } from 'react-i18next';
import { AuditLog } from '../types/audit.types.js';
import { AuditActionBadge } from './AuditActionBadge.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { formatDate } from '../../../lib/utils.js';
import { ShieldCheck, User, Clock, FileCode, Layers } from 'lucide-react';

export interface AuditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

export const AuditDetailsModal: React.FC<AuditDetailsModalProps> = ({
  isOpen,
  onClose,
  log,
}) => {
  const { t } = useTranslation();

  if (!log) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`تفاصيل السجل الأمني #${log.id.slice(0, 8)}`}
    >
      <div className="space-y-4 text-xs">
        {/* Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049]">
          <div className="space-y-1">
            <p className="text-slate-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>المستخدم المسؤول</span>
            </p>
            <p className="font-bold text-slate-900 dark:text-white">
              {log.userName || 'نظام آلي'} {log.userRole ? `(${log.userRole})` : ''}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>تاريخ وتوقيت العملية</span>
            </p>
            <p className="font-mono font-bold text-slate-900 dark:text-white">
              {formatDate(log.createdAt)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>نوع العملية</span>
            </p>
            <div>
              <AuditActionBadge action={log.action} />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>الكيان / المورد</span>
            </p>
            <p className="font-mono font-bold text-slate-900 dark:text-white">
              {log.entity} {log.entityId ? `#${log.entityId}` : ''}
            </p>
          </div>
        </div>

        {/* Changes: Before / After Data */}
        {(log.oldData || log.newData) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Old Data */}
            <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10 p-3 overflow-hidden">
              <p className="font-bold text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5" />
                <span>البيانات السابقة (Before)</span>
              </p>
              <pre className="text-[11px] font-mono bg-white dark:bg-[#0B0F17] p-2.5 rounded-xl overflow-x-auto max-h-48 border border-rose-100 dark:border-rose-900/30 text-slate-800 dark:text-slate-200">
                {log.oldData ? JSON.stringify(log.oldData, null, 2) : '— لا توجد بيانات سابقة —'}
              </pre>
            </div>

            {/* New Data */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10 p-3 overflow-hidden">
              <p className="font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5" />
                <span>البيانات الجديدة (After)</span>
              </p>
              <pre className="text-[11px] font-mono bg-white dark:bg-[#0B0F17] p-2.5 rounded-xl overflow-x-auto max-h-48 border border-emerald-100 dark:border-emerald-900/30 text-slate-800 dark:text-slate-200">
                {log.newData ? JSON.stringify(log.newData, null, 2) : '— لا توجد بيانات جديدة —'}
              </pre>
            </div>
          </div>
        )}

        {/* Metadata */}
        {log.metadata && (
          <div className="rounded-2xl border border-slate-200 dark:border-[#223049] bg-slate-50 dark:bg-[#0B0F17] p-3">
            <p className="font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              بيانات إضافية (Metadata / Context):
            </p>
            <pre className="text-[11px] font-mono bg-white dark:bg-[#131B2A] p-2.5 rounded-xl overflow-x-auto max-h-36 border border-slate-200 dark:border-[#223049] text-slate-700 dark:text-slate-300">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
