import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../../store/hooks.js';
import { clearCart } from '../../../store/slices/cartSlice.js';
import { useCheckout } from '../hooks/useCheckout.js';
import { Sale } from '../types/sale.types.js';
import { PaymentEntry } from '../types/checkout.types.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { SplitPaymentForm } from './SplitPaymentForm.js';
import { formatCurrency } from '../../../lib/utils.js';
import { CreditCard, AlertCircle, User } from 'lucide-react';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sale: Sale) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { items, customer, discount, discountAmount, insurance, loyalty, total } = useAppSelector(
    (state) => state.cart
  );

  const [notes, setNotes] = useState('');
  const [payments, setPayments] = useState<PaymentEntry[]>([
    {
      id: 'initial',
      paymentMethod: 'CASH',
      amount: total,
      referenceNumber: '',
      notes: '',
    },
  ]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkoutMutation = useCheckout();

  useEffect(() => {
    setPayments([
      {
        id: 'initial',
        paymentMethod: 'CASH',
        amount: total,
        referenceNumber: '',
        notes: '',
      },
    ]);
  }, [total]);

  const handleAddPayment = (entry: PaymentEntry) => {
    setPayments([...payments, entry]);
  };

  const handleRemovePayment = (id: string) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  const handleUpdatePayment = (id: string, field: keyof PaymentEntry, value: any) => {
    setPayments(
      payments.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const totalPaid = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  const handleConfirmCheckout = async () => {
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('لا توجد أصناف في السلة لإتمام البيع');
      return;
    }

    if (totalPaid < total) {
      setErrorMessage(`المبلغ المدفوع (${formatCurrency(totalPaid)}) أقل من الإجمالي المستحق (${formatCurrency(total)})`);
      return;
    }

    try {
      const payload = {
        customerId: customer?.id || null,
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
        })),
        discountId: discount?.id || null,
        discountCode: discount?.code || null,
        discountAmount: discount && discountAmount > 0 ? discountAmount : null,
        customerInsuranceId: insurance?.policyId || null,
        redeemPoints: loyalty?.pointsToRedeem || 0,
        payments: payments.map((p) => ({
          paymentMethod: p.paymentMethod,
          amount: p.amount,
          referenceNumber: p.referenceNumber || null,
          notes: p.notes || null,
        })),
        notes: notes.trim() || null,
      };

      const result = await checkoutMutation.mutateAsync(payload);
      dispatch(clearCart());
      onSuccess(result);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('pos.checkoutModalTitle') || 'إتمام عملية البيع والدفع'}
    >
      <div className="space-y-4 text-xs">
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Invoice Target Summary */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-900 dark:text-white">
              العميل: {customer ? customer.name : 'عميل نقدي (Walk-in)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">الأصناف:</span>
            <span className="font-bold">{items.length} صنف</span>
          </div>
        </div>

        {/* Split Payments Form */}
        <div className="space-y-1">
          <label className="block font-bold text-slate-700 dark:text-slate-200">
            طرق الدفع والتحصيل (Split Payments)
          </label>
          <SplitPaymentForm
            payments={payments}
            totalDue={total}
            onAddPayment={handleAddPayment}
            onRemovePayment={handleRemovePayment}
            onUpdatePayment={handleUpdatePayment}
          />
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="block font-bold text-slate-700 dark:text-slate-200">
            ملاحظات الفاتورة (اختياري)
          </label>
          <input
            type="text"
            placeholder="تعليمات خاصة، توصيل، أو رقم طلب خارجي..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-2xl border p-2.5 bg-white dark:bg-[#0B0F17] border-slate-200 dark:border-[#223049] text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1E293B]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={checkoutMutation.isPending}
          >
            {t('common.cancel')}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="lg"
            isLoading={checkoutMutation.isPending}
            onClick={handleConfirmCheckout}
            className="shadow-lg shadow-sky-500/20"
            leftIcon={<CreditCard className="w-4 h-4" />}
          >
            {t('pos.confirmAndPrint') || 'تأكيد البيع وإصدار الفاتورة'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
