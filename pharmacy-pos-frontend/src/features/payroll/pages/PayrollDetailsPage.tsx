import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import {
  usePayroll,
  useApprovePayroll,
  useCancelPayroll,
} from '../hooks/usePayroll.js';
import { PayrollStatusBadge } from '../components/PayrollStatusBadge.js';
import { PayrollPaymentModal } from '../components/PayrollPaymentModal.js';
import { Button } from '../../../components/ui/Button.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { showConfirmDialog } from '../../../lib/alerts.js';
import { formatCurrency, formatDate } from '../../../lib/utils.js';
import {
  Coins,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Printer,
  Calendar,
  User,
  Phone,
  Ban,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const PayrollDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id = '' } = useParams<{ id: string }>();
  const { direction } = useAppSelector((state) => state.ui);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const { data: payroll, isLoading, isError } = usePayroll(id);
  const approveMutation = useApprovePayroll();
  const cancelMutation = useCancelPayroll();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (isError || !payroll) {
    return (
      <EmptyState
        icon={Coins}
        title="مسير الراتب غير موجود"
        description="لم يتم العثور على سجل مسير الراتب المطلوب."
      />
    );
  }

  const handleApprove = async () => {
    const confirmed = await showConfirmDialog({
      title: 'اعتماد مسير الراتب',
      text: `هل أنت متأكد من اعتماد مسير راتب (${payroll.employeeName})؟`,
      confirmButtonText: 'نعم، اعتماد',
      cancelButtonText: 'إلغاء',
      icon: 'question',
    });
    if (confirmed) {
      await approveMutation.mutateAsync(payroll.id);
    }
  };

  const handleCancel = async () => {
    const confirmed = await showConfirmDialog({
      title: 'إلغاء مسير الراتب',
      text: `هل أنت متأكد من إلغاء وحذف مسير راتب (${payroll.employeeName}) نهائياً؟`,
      confirmButtonText: 'نعم، إلغاء المسير',
      cancelButtonText: 'تراجع',
      isDanger: true,
    });
    if (confirmed) {
      await cancelMutation.mutateAsync(payroll.id);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            to="/payroll"
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                مسير راتب: {payroll.employeeName}
              </h1>
              <PayrollStatusBadge status={payroll.status} />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              رقم المسير: #{payroll.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/payroll/${payroll.id}/slip`}>
            <Button
              variant="outline"
              size="md"
              leftIcon={<Printer className="w-4 h-4 text-indigo-600" />}
            >
              طباعة القسيمة
            </Button>
          </Link>

          {payroll.status === 'DRAFT' && (
            <Button
              variant="primary"
              size="md"
              onClick={handleApprove}
              isLoading={approveMutation.isPending}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              اعتماد المسير
            </Button>
          )}

          {payroll.status === 'PENDING' && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsPayModalOpen(true)}
              leftIcon={<CreditCard className="w-4 h-4" />}
            >
              صرف وتسوية الراتب
            </Button>
          )}

          {payroll.status !== 'PAID' && payroll.status !== 'CANCELLED' && (
            <Button
              variant="outline"
              size="md"
              onClick={handleCancel}
              isLoading={cancelMutation.isPending}
              className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              leftIcon={<Ban className="w-4 h-4" />}
            >
              إلغاء
            </Button>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Employee Info */}
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">بيانات الموظف</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-[#0B0F17] text-sky-600 border border-slate-200 dark:border-[#223049]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">اسم الموظف</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {payroll.employeeName} ({payroll.employeeRole})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F17] text-slate-500 border border-slate-200 dark:border-[#223049]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">رقم الهاتف</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {payroll.employeePhone || '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Period & Payment Date Info */}
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">فترة المسير وتاريخ الصرف</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-[#0B0F17] text-indigo-600 border border-slate-200 dark:border-[#223049]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">فترة العمل المستحقة</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {formatDate(payroll.periodStart)} إلى {formatDate(payroll.periodEnd)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-[#0B0F17] text-emerald-600 border border-slate-200 dark:border-[#223049]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">حالة وتاريخ الصرف</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {payroll.paidAt ? formatDate(payroll.paidAt) : 'لم يتم الصرف بعد'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Breakdown Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <CardTitle className="text-sm">تفاصيل بنود واستحقاقات الراتب</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
              <tr className="p-4">
                <td className="py-3 px-5 text-slate-600 dark:text-slate-300 font-bold">
                  الراتب الأساسي (Base Salary)
                </td>
                <td className="py-3 px-5 text-end font-mono font-bold text-slate-900 dark:text-white">
                  {formatCurrency(payroll.baseSalary)} {t('common.currency')}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 text-sky-700 dark:text-sky-300 font-bold">
                  العمولات البيعية المكتسبة (Sales Commission)
                </td>
                <td className="py-3 px-5 text-end font-mono font-bold text-sky-600 dark:text-sky-400">
                  +{formatCurrency(payroll.commission)} {t('common.currency')}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 text-emerald-700 dark:text-emerald-300 font-bold">
                  المكافآت والحوافز (Bonuses)
                </td>
                <td className="py-3 px-5 text-end font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(payroll.bonus)} {t('common.currency')}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 text-rose-600 dark:text-rose-400 font-bold">
                  الاستقطاعات والخصومات (Deductions)
                </td>
                <td className="py-3 px-5 text-end font-mono font-bold text-rose-600 dark:text-rose-400">
                  -{formatCurrency(payroll.deductions)} {t('common.currency')}
                </td>
              </tr>
              <tr className="bg-slate-50 dark:bg-[#0B0F17]/70 border-t-2 border-slate-200 dark:border-[#223049]">
                <td className="py-4 px-5 text-sm font-black text-slate-900 dark:text-white">
                  صافي الراتب النهائي (Net Salary)
                </td>
                <td className="py-4 px-5 text-end font-mono font-black text-lg text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(payroll.netSalary)} {t('common.currency')}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {isPayModalOpen && (
        <PayrollPaymentModal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          payroll={payroll}
        />
      )}
    </div>
  );
};
