import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeartPulse, Calendar, Clock, User, ShieldCheck } from 'lucide-react';
import { formatDate, formatDateTime } from '../../../lib/utils.js';
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
    <div className="hidden print:block mb-6 text-slate-900 border-b-2 border-slate-900 pb-4">
      {/* Official Top Letterhead */}
      <div className="flex items-start justify-between">
        {/* Right: Pharmacy Info */}
        <div className="space-y-1 text-start">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-sky-700 inline" />
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              {t('common.pharmacyName')}
            </h1>
          </div>
          <p className="text-xs text-slate-600 font-bold">
            {t('common.posAndManagement')} • سجل تجاري وترخيص رقم 10482
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            جمهورية مصر العربية — فرع الإدارة الرئيسي
          </p>
        </div>

        {/* Center: Official Title Box */}
        <div className="text-center px-4 py-2 rounded-xl border-2 border-slate-900 bg-slate-50">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            تقرير مالي وتشغيلي رسمي
          </p>
          <h2 className="text-sm font-black text-slate-900 mt-0.5">
            {reportTitle}
          </h2>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            بيانات مدققة من قاعدة البيانات
          </span>
        </div>

        {/* Left: Metadata */}
        <div className="text-end space-y-1 text-xs">
          <p className="font-bold flex items-center justify-end gap-1 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>تاريخ ووقت الطباعة:</span>
          </p>
          <p className="font-mono font-bold text-slate-900 text-[11px]">
            {formatDateTime(new Date())}
          </p>
          {user?.name && (
            <p className="text-slate-600 flex items-center justify-end gap-1 font-bold text-[11px]">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>المستخدم المسؤول: {user.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Report Filter Details Strip */}
      <div className="mt-4 p-2.5 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-between text-xs font-bold text-slate-800">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-slate-600" />
          <span>الفترة الزمنية المحددة للتقرير: </span>
          <span className="font-mono text-slate-900">
            {from ? formatDate(from) : 'من بداية تسجيل النظام'} — {to ? formatDate(to) : 'حتى تاريخ اليوم'}
          </span>
        </div>

        <div className="text-[11px] text-slate-600 font-mono">
          العملة الرسمية: الجنيه المصري (ج.م)
        </div>
      </div>
    </div>
  );
};

export const ReportPrintFooter: React.FC = () => {
  return (
    <div className="hidden print:block mt-10 pt-4 border-t-2 border-slate-900 text-xs text-slate-800">
      {/* Signatures */}
      <div className="grid grid-cols-3 gap-6 text-center pt-2">
        <div className="space-y-8">
          <p className="font-bold text-slate-900 text-xs">إعداد وتدقيق الحسابات</p>
          <div className="border-b-2 border-dashed border-slate-400 w-36 mx-auto" />
        </div>
        <div className="space-y-8">
          <p className="font-bold text-slate-900 text-xs">المحاسب المالي المسؤول</p>
          <div className="border-b-2 border-dashed border-slate-400 w-36 mx-auto" />
        </div>
        <div className="space-y-8">
          <p className="font-bold text-slate-900 text-xs">اعتماد إدارة الصيدلية</p>
          <div className="border-b-2 border-dashed border-slate-400 w-36 mx-auto" />
        </div>
      </div>

      {/* Document Legal Footnote */}
      <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>وثيقة رقمية معتمدة ومستخرجة آلياً من نظام إدارة الصيدليات المتقدم</span>
        <span>صفحة 1 من 1</span>
      </div>
    </div>
  );
};
