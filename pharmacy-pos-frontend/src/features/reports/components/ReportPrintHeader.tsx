import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeartPulse, Calendar, Clock, User } from 'lucide-react';
import { formatDate } from '../../../lib/utils.js';
import { useAppSelector } from '../../../store/hooks.js';

export interface ReportPrintHeaderProps {
  reportTitle: string;
  from?: string;
  to?: string;
}

export const ReportPrintHeader: React.FC<ReportPrintHeaderProps> = ({
  reportTitle,
  from,
  to,
}) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4 text-slate-900">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-7 h-7 text-sky-600 inline" />
            <h1 className="text-2xl font-black tracking-tight">{t('common.pharmacyName')}</h1>
          </div>
          <p className="text-xs text-slate-600 font-bold mt-1">
            {t('common.posAndManagement')} — {t('common.version')}
          </p>
        </div>

        <div className="text-end space-y-1 text-xs">
          <p className="font-bold flex items-center justify-end gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>تاريخ ووقت الطباعة:</span>
          </p>
          <p className="font-mono font-black text-slate-900 text-sm">
            {formatDate(new Date())}
          </p>
          {user?.name && (
            <p className="text-slate-600 flex items-center justify-end gap-1 font-bold">
              <User className="w-3.5 h-3.5" />
              <span>المستخدم: {user.name} ({user.role})</span>
            </p>
          )}
        </div>
      </div>

      {/* Report Info Badge */}
      <div className="mt-4 p-3 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-500 font-bold">نوع التقرير: </span>
          <span className="font-black text-slate-900 text-sm">{reportTitle}</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>النطاق الزمني: </span>
          <span>
            {from ? formatDate(from) : 'من بداية التسجيل'} — {to ? formatDate(to) : 'حتى تاريخه'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const ReportPrintFooter: React.FC = () => {
  return (
    <div className="hidden print:block mt-12 pt-6 border-t-2 border-dashed border-slate-300 text-xs text-slate-700">
      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="font-bold mb-10">إعداد وتدقيق البيانات</p>
          <div className="border-b border-slate-400 w-36 mx-auto" />
        </div>
        <div>
          <p className="font-bold mb-10">المحاسب المالي المسؤول</p>
          <div className="border-b border-slate-400 w-36 mx-auto" />
        </div>
        <div>
          <p className="font-bold mb-10">اعتماد إدارة الصيدلية</p>
          <div className="border-b border-slate-400 w-36 mx-auto" />
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] text-slate-400 font-mono">
        تم استخراج هذا التقرير آلياً من نظام إدارة الصيدليات ونقاط البيع • وثيقة مالية رسمية
      </div>
    </div>
  );
};
