import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePayPayroll } from '../hooks/usePayroll.js';
import { Payroll, PaymentMethod } from '../types/payroll.types.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { formatCurrency } from '../../../lib/utils.js';
import { CreditCard, AlertCircle, Banknote } from 'lucide-react';

export interface PayrollPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: Payroll | null;
}

export const PayrollPaymentModal: React.FC<PayrollPaymentModalProps> = ({
  isOpen,
  onClose,
  payroll,
}) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const payMutation = usePayPayroll();

  if (!payroll) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await payMutation.mutateAsync({
        id: payroll.id,
        data: {
          paymentMethod,
          notes: notes || undefined,
        },
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="صرف وتسوية راتب الموظف"
    >
      <form onSubmit={handlePay} className="space-y-4 text-xs">
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Employee & Net Amount Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-bold">الموظف المستحق</p>
            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
              {payroll.employeeName}
            </p>
          </div>
          <div className="text-end">
            <p className="text-[11px] text-slate-400 font-bold">صافي الراتب المستحق</p>
            <p className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-lg mt-0.5">
              {formatCurrency(payroll.netSalary)} {t('common.currency')}
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
            طريقة صرف الراتب *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
              <Banknote className="w-4 h-4" />
            </div>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full rounded-2xl border py-2.5 ps-10 pe-3 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="CASH">نقداً من الخزينة (CASH)</option>
              <option value="VISA">تحويل بنكي / فيزا (VISA)</option>
              <option value="WALLET">محفظة إلكترونية (WALLET)</option>
              <option value="OTHER">أخرى (OTHER)</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <Input
            label="ملاحظات الصرف (اختياري)"
            placeholder="مثال: تم التحويل لحساب فودافون كاش / الخزينة"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1E293B]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {t('common.cancel')}
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={payMutation.isPending}
            leftIcon={<CreditCard className="w-4 h-4" />}
          >
            تأكيد صرف الراتب
          </Button>
        </div>
      </form>
    </Modal>
  );
};
