import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../store/hooks.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Button } from '../../../components/ui/Button.js';
import { CreditCard } from 'lucide-react';

export interface SaleSummaryProps {
  onOpenCheckout: () => void;
}

export const SaleSummary: React.FC<SaleSummaryProps> = ({ onOpenCheckout }) => {
  const { t } = useTranslation();
  const { subtotal, discountAmount, insuranceAmount, taxAmount, total, items } = useAppSelector(
    (state) => state.cart
  );

  const hasItems = items.length > 0;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#1E293B] p-4 shadow-xs space-y-3">
      {/* Financial Details */}
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between items-center text-slate-500">
          <span>{t('pos.subtotal')}:</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 font-bold">
            <span>
              {t('pos.discount')} ({subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(1).replace(/\.0$/, '') : 0}%):
            </span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        {insuranceAmount > 0 && (
          <div className="flex justify-between items-center text-teal-600 dark:text-teal-400 font-bold">
            <span>تغطية التأمين:</span>
            <span>-{formatCurrency(insuranceAmount)}</span>
          </div>
        )}

        {taxAmount > 0 && (
          <div className="flex justify-between items-center text-slate-500">
            <span>الضريبة:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              +{formatCurrency(taxAmount)}
            </span>
          </div>
        )}

        {/* Grand Total */}
        <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-[#1E293B]">
          <span className="font-black text-sm text-slate-900 dark:text-white">
            {t('pos.grandTotal')}:
          </span>
          <span className="font-black text-xl text-sky-600 dark:text-sky-400 tracking-tight">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={onOpenCheckout}
        disabled={!hasItems}
        className="w-full py-4 text-sm font-black shadow-lg shadow-sky-500/20"
        leftIcon={<CreditCard className="w-5 h-5" />}
      >
        {t('pos.checkoutButton') || 'دفع وإصدار الفاتورة (F8)'}
      </Button>
    </div>
  );
};
