import React from 'react';
import { useTranslation } from 'react-i18next';
import { Payroll } from '../types/payroll.types.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { HeartPulse, CheckCircle2, Phone, Calendar, User } from 'lucide-react';

export interface SalarySlipViewProps {
  payroll: Payroll;
}

export const SalarySlipView: React.FC<SalarySlipViewProps> = ({ payroll }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white text-slate-900 p-8 rounded-3xl border border-slate-200 shadow-xs max-w-2xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
      {/* Slip Header */}
      <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-sky-600" />
            <h2 className="text-lg font-black text-slate-900">{t('common.pharmacyName')}</h2>
          </div>
          <p className="text-xs text-slate-500 font-bold mt-0.5">
            قسيمة استلام راتب ومستحقات موظف (Payslip)
          </p>
        </div>
        <div className="text-end">
          <p className="text-xs font-mono font-bold text-slate-500">رقم القسيمة</p>
          <p className="text-sm font-mono font-black">#{payroll.id.slice(0, 8)}</p>
        </div>
      </div>

      {/* Employee & Period Details */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-xs">
        <div className="space-y-1">
          <p className="text-slate-500 flex items-center gap-1 font-bold">
            <User className="w-3.5 h-3.5" />
            <span>اسم الموظف</span>
          </p>
          <p className="font-black text-slate-900 text-sm">{payroll.employeeName}</p>
          <p className="text-slate-500 font-mono flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{payroll.employeePhone || '—'}</span>
          </p>
        </div>

        <div className="space-y-1 text-end">
          <p className="text-slate-500 flex items-center justify-end gap-1 font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>فترة المسير</span>
          </p>
          <p className="font-bold font-mono text-slate-900">
            {formatDate(payroll.periodStart)} إلى {formatDate(payroll.periodEnd)}
          </p>
          <p className="text-slate-500 text-[11px]">
            الدور الوظيفي: <span className="font-bold">{payroll.employeeRole}</span>
          </p>
        </div>
      </div>

      {/* Salary Components Breakdown Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6 text-xs">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-200 font-bold uppercase text-slate-600">
            <tr>
              <th className="py-2.5 px-4 text-start">بند الاستحقاق / الاستقطاع</th>
              <th className="py-2.5 px-4 text-end">المبلغ (ج.م)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            <tr>
              <td className="py-2.5 px-4 text-slate-700 font-bold">الراتب الأساسي (Base Salary)</td>
              <td className="py-2.5 px-4 text-end font-bold text-slate-900">
                {formatCurrency(payroll.baseSalary)}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 text-sky-700 font-bold">العمولات البيعية المستحقة (Sales Commission)</td>
              <td className="py-2.5 px-4 text-end font-bold text-sky-700">
                +{formatCurrency(payroll.commission)}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 text-emerald-700 font-bold">المكافآت والحوافز الإضافية (Bonuses)</td>
              <td className="py-2.5 px-4 text-end font-bold text-emerald-700">
                +{formatCurrency(payroll.bonus)}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 text-rose-600 font-bold">الاستقطاعات والخصومات (Deductions)</td>
              <td className="py-2.5 px-4 text-end font-bold text-rose-600">
                -{formatCurrency(payroll.deductions)}
              </td>
            </tr>
          </tbody>
          <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-900">
            <tr>
              <td className="py-3 px-4 text-base font-black text-slate-900">
                صافي الراتب المستحق (Net Payable)
              </td>
              <td className="py-3 px-4 text-end font-mono font-black text-lg text-emerald-700">
                {formatCurrency(payroll.netSalary)} {t('common.currency')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Signature Area */}
      <div className="grid grid-cols-2 gap-8 pt-8 border-t border-dashed border-slate-300 text-xs">
        <div className="text-center">
          <p className="font-bold text-slate-700 mb-8">توقيع المستلم (الموظف)</p>
          <div className="border-b border-slate-400 w-36 mx-auto" />
        </div>
        <div className="text-center">
          <p className="font-bold text-slate-700 mb-8">اعتماد الإدارة المالية</p>
          <div className="border-b border-slate-400 w-36 mx-auto" />
        </div>
      </div>

      {/* Footer Status */}
      {payroll.paidAt && (
        <div className="mt-8 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold text-xs flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم صرف هذا الراتب بتاريخ: {formatDate(payroll.paidAt)}</span>
        </div>
      )}
    </div>
  );
};
