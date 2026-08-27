import React from 'react';
import { useTranslation } from 'react-i18next';
import { Payroll } from '../types/payroll.types.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import { useAppSelector } from '../../../store/hooks.js';
import { PharmacyBrandLogo } from '../../../components/common/PharmacyBrandLogo.js';
import { CheckCircle2, Phone, Calendar, User, ShieldCheck } from 'lucide-react';

export interface SalarySlipViewProps {
  payroll: Payroll;
}

export const SalarySlipView: React.FC<SalarySlipViewProps> = ({ payroll }) => {
  const { t } = useTranslation();
  const { publicSettings } = useAppSelector((state) => state.settings);

  return (
    <div
      id="salary-slip-print"
      className="bg-white text-slate-900 p-8 rounded-3xl border border-slate-200 shadow-xs max-w-2xl mx-auto"
    >
      {/* Slip Header */}
      <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <PharmacyBrandLogo size="md" showFallbackGradient={false} />
            <h2 className="text-xl font-black text-slate-900">
              {publicSettings.pharmacyName || t('common.pharmacyName')}
            </h2>
          </div>
          <p className="text-xs text-slate-600 font-bold mt-1">
            قسيمة استلام راتب ومستحقات موظف (Salary Payslip)
          </p>
        </div>
        <div className="text-end">
          <p className="text-xs font-mono font-bold text-slate-500">رقم القسيمة</p>
          <p className="text-base font-mono font-black text-slate-900">#{payroll.id.slice(0, 8)}</p>
        </div>
      </div>

      {/* Employee & Period Details */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-xs">
        <div className="space-y-1.5">
          <p className="text-slate-500 flex items-center gap-1 font-bold">
            <User className="w-3.5 h-3.5 text-sky-600" />
            <span>اسم الموظف المستحق:</span>
          </p>
          <p className="font-black text-slate-900 text-sm">{payroll.employeeName}</p>
          {payroll.employeePhone && (
            <p className="text-slate-600 font-mono flex items-center gap-1 font-bold">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{payroll.employeePhone}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5 text-end">
          <p className="text-slate-500 flex items-center justify-end gap-1 font-bold">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>فترة المسير:</span>
          </p>
          <p className="font-bold font-mono text-slate-900">
            {formatDate(payroll.periodStart)} إلى {formatDate(payroll.periodEnd)}
          </p>
          <p className="text-slate-600 text-xs font-bold flex items-center justify-end gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>الدور الوظيفي: {payroll.employeeRole}</span>
          </p>
        </div>
      </div>

      {/* Salary Components Breakdown Table */}
      <div className="border border-slate-300 rounded-2xl overflow-hidden mb-6 text-xs">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-700">
            <tr>
              <th className="py-3 px-4 text-start">بند الاستحقاق / الاستقطاع</th>
              <th className="py-3 px-4 text-end">المبلغ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono">
            <tr>
              <td className="py-3 px-4 text-slate-800 font-bold">الراتب الأساسي (Base Salary)</td>
              <td className="py-3 px-4 text-end font-bold text-slate-900">
                {formatCurrency(payroll.baseSalary)} {t('common.currency')}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-sky-800 font-bold">العمولات البيعية المكتسبة (Sales Commission)</td>
              <td className="py-3 px-4 text-end font-bold text-sky-800">
                +{formatCurrency(payroll.commission)} {t('common.currency')}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-emerald-800 font-bold">المكافآت والحوافز الإضافية (Bonuses)</td>
              <td className="py-3 px-4 text-end font-bold text-emerald-800">
                +{formatCurrency(payroll.bonus)} {t('common.currency')}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-rose-700 font-bold">الاستقطاعات والخصومات (Deductions)</td>
              <td className="py-3 px-4 text-end font-bold text-rose-700">
                -{formatCurrency(payroll.deductions)} {t('common.currency')}
              </td>
            </tr>
          </tbody>
          <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-900">
            <tr>
              <td className="py-3.5 px-4 text-sm font-black text-slate-900">
                صافي الراتب المستحق للصرف (Net Payable)
              </td>
              <td className="py-3.5 px-4 text-end font-mono font-black text-base text-emerald-700">
                {formatCurrency(payroll.netSalary)} {t('common.currency')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Signature Area */}
      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-dashed border-slate-300 text-xs">
        <div className="text-center">
          <p className="font-bold text-slate-700 mb-10">توقيع المستلم (الموظف)</p>
          <div className="border-b border-slate-400 w-44 mx-auto" />
        </div>
        <div className="text-center">
          <p className="font-bold text-slate-700 mb-10">اعتماد الإدارة المالية والصيدلية</p>
          <div className="border-b border-slate-400 w-44 mx-auto" />
        </div>
      </div>

      {/* Footer Status */}
      {payroll.paidAt && (
        <div className="mt-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold text-xs flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم صرف هذا الراتب بتاريخ: {formatDate(payroll.paidAt)}</span>
        </div>
      )}
    </div>
  );
};
