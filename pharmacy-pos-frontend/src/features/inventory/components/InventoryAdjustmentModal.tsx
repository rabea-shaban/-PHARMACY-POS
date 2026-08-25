import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { useAdjustStock } from '../hooks/useInventory.js';
import { InventoryTransactionType } from '../types/inventory.types.js';

export interface InventoryAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  batchId: string;
  batchNumber: string;
  currentQuantity: number;
}

export const InventoryAdjustmentModal: React.FC<InventoryAdjustmentModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  batchId,
  batchNumber,
  currentQuantity,
}) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState<number>(0);
  const [type, setType] = useState<InventoryTransactionType>('ADJUSTMENT');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const adjustMutation = useAdjustStock();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity === 0) {
      setError(t('inventory.adjustmentQuantityZeroError'));
      return;
    }
    if (!reason.trim()) {
      setError(t('inventory.adjustmentReasonRequired'));
      return;
    }

    try {
      await adjustMutation.mutateAsync({
        productId,
        batchId,
        quantity,
        type,
        reason,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('inventory.stockAdjustmentTitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product & Batch Summary Card */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200/60 dark:border-[#223049] text-xs space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">{productName}</p>
          <p className="text-slate-500 dark:text-slate-400">
            {t('dashboard.batchNo')}: {batchNumber} • {t('products.currentStockLabel')}: {currentQuantity}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-bold">
            {error}
          </div>
        )}

        {/* Transaction Type */}
        <div className="space-y-1.5 text-start">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
            {t('inventory.adjustmentType')}
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as InventoryTransactionType)}
            className="w-full rounded-2xl border py-2.5 px-3 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="ADJUSTMENT">{t('inventory.typeAdjustment')}</option>
            <option value="DAMAGE">{t('inventory.typeDamage')}</option>
            <option value="EXPIRED">{t('inventory.typeExpired')}</option>
            <option value="MANUAL_IN">{t('inventory.typeManualIn')}</option>
            <option value="MANUAL_OUT">{t('inventory.typeManualOut')}</option>
          </select>
        </div>

        {/* Quantity (positive for increment, negative for decrement) */}
        <Input
          label={t('inventory.adjustmentQuantity')}
          type="number"
          step="1"
          placeholder="+5 أو -3"
          value={quantity || ''}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          helperText={t('inventory.adjustmentQuantityHelper')}
          required
        />

        {/* Reason */}
        <div className="space-y-1.5 text-start">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
            {t('inventory.adjustmentReason')}
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('inventory.adjustmentReasonPlaceholder')}
            className="block w-full rounded-2xl border p-3 text-xs bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 dark:bg-[#0B0F17] dark:border-[#223049] dark:text-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#1E293B]">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary" isLoading={adjustMutation.isPending}>
            {t('inventory.confirmAdjustment')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
