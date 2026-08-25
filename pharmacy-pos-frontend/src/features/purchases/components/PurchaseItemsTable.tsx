import React from 'react';
import { useTranslation } from 'react-i18next';
import { PurchaseItemFormValues } from '../schemas/purchaseSchemas.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Trash2, Pill } from 'lucide-react';
import { EmptyState } from '../../../components/common/EmptyState.js';

export interface PurchaseItemsTableProps {
  items: PurchaseItemFormValues[];
  onUpdateItem: (index: number, field: keyof PurchaseItemFormValues, value: any) => void;
  onRemoveItem: (index: number) => void;
}

export const PurchaseItemsTable: React.FC<PurchaseItemsTableProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
}) => {
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-slate-50/50 dark:bg-[#0B0F17]/30 border border-dashed border-slate-200 dark:border-[#223049] text-center">
        <EmptyState
          icon={Pill}
          title={t('purchases.noItemsInPurchase')}
          description={t('purchases.noItemsInPurchaseDesc')}
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
            <tr>
              <th className="py-3.5 px-4 text-start">{t('products.colProduct')}</th>
              <th className="py-3.5 px-3 text-start w-28">{t('purchases.colQuantity')}</th>
              <th className="py-3.5 px-3 text-start w-32">{t('purchases.colUnitCost')}</th>
              <th className="py-3.5 px-3 text-start w-32">{t('dashboard.batchNo')}</th>
              <th className="py-3.5 px-3 text-start w-36">{t('products.expiryDate')}</th>
              <th className="py-3.5 px-4 text-start">{t('purchases.colSubtotal')}</th>
              <th className="py-3.5 px-3 text-end w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
            {items.map((item, index) => {
              const rowTotal = item.quantity * item.unitCost;

              return (
                <tr key={`${item.productId}-${index}`} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                  {/* Product Details */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <div>{item.productName || 'دواء'}</div>
                    {item.barcode && (
                      <span className="text-[10px] font-mono text-slate-400 font-normal">
                        {item.barcode}
                      </span>
                    )}
                  </td>

                  {/* Quantity Input */}
                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full rounded-xl border py-1.5 px-2.5 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 dark:border-[#223049] text-slate-900 dark:text-white font-black text-center focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </td>

                  {/* Unit Cost Input */}
                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitCost}
                      onChange={(e) => onUpdateItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border py-1.5 px-2.5 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 dark:border-[#223049] text-slate-900 dark:text-white font-bold text-center focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </td>

                  {/* Batch Number */}
                  <td className="py-3.5 px-3">
                    <input
                      type="text"
                      placeholder="BN-XXXX"
                      value={item.batchNumber || ''}
                      onChange={(e) => onUpdateItem(index, 'batchNumber', e.target.value)}
                      className="w-full rounded-xl border py-1.5 px-2.5 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 dark:border-[#223049] text-slate-900 dark:text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </td>

                  {/* Expiry Date */}
                  <td className="py-3.5 px-3">
                    <input
                      type="date"
                      value={item.expiryDate || ''}
                      onChange={(e) => onUpdateItem(index, 'expiryDate', e.target.value)}
                      className="w-full rounded-xl border py-1.5 px-2 text-xs bg-slate-50 dark:bg-[#0B0F17] border-slate-200 dark:border-[#223049] text-slate-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </td>

                  {/* Row Total */}
                  <td className="py-3.5 px-4 font-black text-sky-600 dark:text-sky-400 text-sm">
                    {formatCurrency(rowTotal)}
                  </td>

                  {/* Delete Button */}
                  <td className="py-3.5 px-3 text-end">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title={t('common.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
