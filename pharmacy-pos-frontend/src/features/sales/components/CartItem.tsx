import React from 'react';
import { useTranslation } from 'react-i18next';
import { CartItemModel } from '../types/checkout.types.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Plus, Minus, Trash2 } from 'lucide-react';

export interface CartItemProps {
  item: CartItemModel;
  onUpdateQty: (qty: number) => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQty,
  onRemove,
}) => {
  const { t } = useTranslation();
  const maxStock = item.product.currentStock;

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-100 dark:border-[#1E293B] hover:border-sky-200 dark:hover:border-[#283850] transition-all group">
      {/* Item info */}
      <div className="min-w-0 flex-1 pe-2">
        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
          {item.product.name}
        </h4>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
          <span className="font-mono">{formatCurrency(item.unitPrice)}</span>
          {item.product.barcode && (
            <span className="font-mono truncate max-w-[100px]">
              • {item.product.barcode}
            </span>
          )}
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center gap-1.5 shrink-0 px-2">
        <button
          type="button"
          onClick={() => onUpdateQty(item.quantity - 1)}
          className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1C273B] dark:hover:bg-[#25344D] text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <input
          type="number"
          min="1"
          max={maxStock}
          value={item.quantity}
          onChange={(e) => onUpdateQty(parseInt(e.target.value) || 1)}
          className="w-10 text-center font-bold text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none"
        />

        <button
          type="button"
          onClick={() => onUpdateQty(item.quantity + 1)}
          disabled={item.quantity >= maxStock}
          className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1C273B] dark:hover:bg-[#25344D] text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Total & Delete Button */}
      <div className="flex items-center gap-3 shrink-0 ps-2">
        <div className="text-end">
          <p className="font-black text-xs text-sky-600 dark:text-sky-400">
            {formatCurrency(item.total)}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-xl text-slate-300 group-hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          title={t('common.delete')}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
