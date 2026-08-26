import React from 'react';
import { useTranslation } from 'react-i18next';
import { CommissionTransaction } from '../types/commission.types.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { HeartPulse, Award, Calendar, User, TrendingUp } from 'lucide-react';

export interface CommissionStatementViewProps {
  userName: string;
  userRole?: string;
  transactions: CommissionTransaction[];
  startDate?: string;
  endDate?: string;
}

export const CommissionStatementView: React.FC<CommissionStatementViewProps> = ({
  userName,
  userRole,
  transactions,
  startDate,
  endDate,
}) => {
  const { t } = useTranslation();

  const totalSales = transactions.reduce((acc, tx) => acc + (tx.salesAmount || 0), 0);
  const totalCommission = transactions.reduce((acc, tx) => acc + (tx.commissionAmount || 0), 0);

  return (
    <div
      id="salary-slip-print"
      className="bg-white text-slate-900 p-8 rounded-3xl border border-slate-200 shadow-xs max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-sky-600" />
            <h2 className="text-xl font-black text-slate-900">{t('common.pharmacyName')}</h2>
          </div>
          <p className="text-xs text-slate-600 font-bold mt-1">
            كشف استحقاق عمولات وحوافز المبيعات (Commission Statement)
          </p>
        </div>
        <div className="text-end">
          <p className="text-xs font-mono font-bold text-slate-500">تاريخ استخراج التقرير</p>
          <p className="text-sm font-mono font-black text-slate-900">{formatDate(new Date())}</p>
        </div>
      </div>

      {/* Staff & Period Card */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-xs">
        <div className="space-y-1.5">
          <p className="text-slate-500 flex items-center gap-1 font-bold">
            <User className="w-3.5 h-3.5 text-sky-600" />
            <span>اسم الصيدلي / الموظف:</span>
          </p>
          <p className="font-black text-slate-900 text-sm">{userName}</p>
          {userRole && <p className="text-slate-600 font-bold text-xs">الدور الوظيفي: {userRole}</p>}
        </div>

        <div className="space-y-1.5 text-end">
          <p className="text-slate-500 flex items-center justify-end gap-1 font-bold">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>نطاق الفترة المستحقة:</span>
          </p>
          <p className="font-bold font-mono text-slate-900">
            {startDate ? formatDate(startDate) : 'من البداية'} إلى {endDate ? formatDate(endDate) : 'الآن'}
          </p>
          <p className="text-slate-600 font-bold text-xs">
            عدد الحركات المؤهلة: {transactions.length} حركة
          </p>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900">
          <span className="font-bold text-[11px] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            إجمالي المبيعات المحققة
          </span>
          <p className="text-lg font-black font-mono mt-1 text-sky-950">
            {formatCurrency(totalSales)} {t('common.currency')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
          <span className="font-bold text-[11px] flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            صافي العمولات المستحقة
          </span>
          <p className="text-lg font-black font-mono mt-1 text-emerald-950">
            +{formatCurrency(totalCommission)} {t('common.currency')}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="border border-slate-300 rounded-2xl overflow-hidden mb-6 text-xs">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-700">
            <tr>
              <th className="py-2.5 px-3 text-start">رقم الفاتورة</th>
              <th className="py-2.5 px-3 text-start">التاريخ</th>
              <th className="py-2.5 px-3 text-start">قاعدة العمولة</th>
              <th className="py-2.5 px-3 text-end">قيمة المبيعات</th>
              <th className="py-2.5 px-3 text-end">النسبة</th>
              <th className="py-2.5 px-3 text-end">مبلغ العمولة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono">
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="py-2.5 px-3 font-bold text-slate-900">
                  {tx.invoiceNumber ? `#${tx.invoiceNumber}` : '—'}
                </td>
                <td className="py-2.5 px-3 text-slate-600 text-[11px]">{formatDate(tx.createdAt)}</td>
                <td className="py-2.5 px-3 text-slate-700 font-sans font-bold">
                  {tx.commissionRuleName || 'النسبة الافتراضية'}
                </td>
                <td className="py-2.5 px-3 text-end font-bold text-slate-800">
                  {formatCurrency(tx.salesAmount)}
                </td>
                <td className="py-2.5 px-3 text-end text-slate-600">{tx.commissionRate}%</td>
                <td className="py-2.5 px-3 text-end font-black text-emerald-700">
                  +{formatCurrency(tx.commissionAmount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-900">
            <tr>
              <td colSpan={5} className="py-3 px-3 text-sm font-black text-slate-900">
                إجمالي العمولات المستحقة الصرف
              </td>
              <td className="py-3 px-3 text-end font-mono font-black text-base text-emerald-700">
                +{formatCurrency(totalCommission)} {t('common.currency')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Signature Section */}
      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-dashed border-slate-300 text-xs">
        <div className="text-center">
          <p className="font-bold text-slate-700 mb-10">توقيع الصيدلي المستحق</p>
          <div className="border-b border-slate-400 w-44 mx-auto" />
        </div>
        <div className="text-center">
          <p className="font-bold text-slate-700 mb-10">اعتماد إدارة الصيدلية والحسابات</p>
          <div className="border-b border-slate-400 w-44 mx-auto" />
        </div>
      </div>
    </div>
  );
};
