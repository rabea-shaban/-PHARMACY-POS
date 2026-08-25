import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { useReceivePurchase } from '../hooks/usePurchases.js';
import { Purchase } from '../types/purchase.types.js';
import { PackageCheck, AlertCircle } from 'lucide-react';

export interface ReceivePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase;
}

export const ReceivePurchaseModal: React.FC<ReceivePurchaseModalProps> = ({
  isOpen,
  onClose,
  purchase,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const receiveMutation = useReceivePurchase();

  const handleConfirm = async () => {
    setError(null);
    try {
      await receiveMutation.mutateAsync({
        id: purchase.id,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('purchases.receiveModalTitle')}>
      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50 flex items-start gap-3">
          <PackageCheck className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-slate-900 dark:text-white">
              {t('purchases.receiveModalHeading')}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              {t('purchases.receiveModalDesc')}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Invoices Items Summary */}
        <div className="rounded-2xl border border-slate-100 dark:border-[#1E293B] divide-y divide-slate-100 dark:divide-[#1E293B] max-h-48 overflow-y-auto">
          {purchase.items.map((item) => (
            <div key={item.id} className="p-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {item.product?.name || item.productName || 'دواء'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {t('dashboard.batchNo')}: {item.batchNumber || '—'}
                </p>
              </div>
              <span className="font-black text-sky-600 dark:text-sky-400">
                {item.quantity} {t('dashboard.unitsUnit')}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1E293B]">
          <Button type="button" variant="outline" onClick={onClose} disabled={receiveMutation.isPending}>
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="primary"
            isLoading={receiveMutation.isPending}
            onClick={handleConfirm}
          >
            {t('purchases.confirmReceive')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
