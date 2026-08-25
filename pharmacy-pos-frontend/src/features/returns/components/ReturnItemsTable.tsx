import React from 'react';
import { SaleItem } from '../../sales/types/sale.types.js';
import { formatCurrency } from '../../../lib/utils.js';
import { CheckSquare, Square, Minus, Plus } from 'lucide-react';

export interface SelectedReturnItem {
  saleItemId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  originalQuantity: number;
  returnQuantity: number;
  refundTotal: number;
}

export interface ReturnItemsTableProps {
  saleItems: SaleItem[];
  selectedItems: Record<string, SelectedReturnItem>;
  onToggleItem: (item: SaleItem) => void;
  onUpdateQuantity: (saleItemId: string, quantity: number) => void;
}

export const ReturnItemsTable: React.FC<ReturnItemsTableProps> = ({
  saleItems,
  selectedItems,
  onToggleItem,
  onUpdateQuantity,
}) => {

  return (
    <div className="rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200/80 dark:border-[#223049] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
            <tr>
              <th className="py-3.5 px-4 text-start w-12">استرجاع</th>
              <th className="py-3.5 px-4 text-start">الدواء / الصنف</th>
              <th className="py-3.5 px-4 text-start">الكمية بالفاتورة</th>
              <th className="py-3.5 px-4 text-start">سعر الوحدة</th>
              <th className="py-3.5 px-4 text-start w-36">الكمية المسترجعة</th>
              <th className="py-3.5 px-4 text-end">مبلغ الاسترداد</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
            {saleItems.map((item) => {
              const isSelected = Boolean(selectedItems[item.id]);
              const returnQty = selectedItems[item.id]?.returnQuantity || 1;
              const refundAmount = selectedItems[item.id]?.refundTotal || item.unitPrice * returnQty;

              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-sky-50/60 dark:bg-[#1C273B]/80'
                      : 'hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/40'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleItem(item)}
                      className="text-sky-600 dark:text-sky-400 transition-transform active:scale-90 cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                  </td>

                  {/* Product Details */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <div>{item.productName}</div>
                    {item.batchNumber && (
                      <span className="text-[10px] font-mono text-slate-400 font-normal">
                        التشغيلة: {item.batchNumber}
                      </span>
                    )}
                  </td>

                  {/* Original Quantity */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-bold">
                    {item.quantity} عبوة
                  </td>

                  {/* Unit Price */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {formatCurrency(item.unitPrice)}
                  </td>

                  {/* Return Quantity Stepper */}
                  <td className="py-3.5 px-4">
                    {isSelected ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, returnQty - 1)}
                          disabled={returnQty <= 1}
                          className="w-6 h-6 rounded-lg bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <input
                          type="number"
                          min="1"
                          max={item.quantity}
                          value={returnQty}
                          onChange={(e) =>
                            onUpdateQuantity(
                              item.id,
                              Math.min(item.quantity, Math.max(1, parseInt(e.target.value) || 1))
                            )
                          }
                          className="w-12 text-center font-bold text-xs bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] rounded-lg py-1 text-slate-900 dark:text-white focus:outline-none"
                        />

                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, returnQty + 1)}
                          disabled={returnQty >= item.quantity}
                          className="w-6 h-6 rounded-lg bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </td>

                  {/* Refund Total */}
                  <td className="py-3.5 px-4 text-end font-black text-sm text-sky-600 dark:text-sky-400">
                    {isSelected ? formatCurrency(refundAmount) : '—'}
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
