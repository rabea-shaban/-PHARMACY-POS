import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartItemModel } from '../types/checkout.types.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Plus, Minus, Trash2, Pill } from 'lucide-react';
import { MedicationInstructionModal } from './MedicationInstructionModal.js';
import { useAppDispatch } from '../../../store/hooks.js';
import { setItemMedicationInstruction } from '../../../store/slices/cartSlice.js';

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
  const { t, i18n } = useTranslation();
  const isAr = i18n.language !== 'en';
  const dispatch = useAppDispatch();
  const maxStock = item.product.currentStock;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col p-3 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-100 dark:border-[#1E293B] hover:border-sky-200 dark:hover:border-[#283850] transition-all group gap-2">
      <div className="flex items-center justify-between">
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

      {/* Medication Instruction Quick Action / Summary */}
      <div className="flex items-center justify-between pt-1.5 border-t border-slate-50 dark:border-slate-800/80 text-[11px]">
        {item.medicationInstruction ? (
          <div
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 cursor-pointer hover:opacity-85 transition truncate max-w-[85%]"
          >
            <Pill className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="font-bold">
              {item.medicationInstruction.type === 'CHRONIC' ? '🔴' : '🔵'} {item.medicationInstruction.dosage} - {item.medicationInstruction.frequency}
            </span>
            {item.medicationInstruction.doctorNotes && (
              <span className="text-emerald-600 dark:text-emerald-400 truncate">
                ({item.medicationInstruction.doctorNotes})
              </span>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition text-[11px] font-medium"
          >
            <Pill className="w-3 h-3" />
            <span>{isAr ? '+ تحديد الجرعة والمواعيد' : '+ Set Dosage & Times'}</span>
          </button>
        )}

        {item.medicationInstruction && (
          <button
            type="button"
            onClick={() =>
              dispatch(
                setItemMedicationInstruction({
                  productId: item.productId,
                  instruction: null,
                })
              )
            }
            className="text-slate-400 hover:text-rose-500 text-[10px]"
          >
            {isAr ? 'مسح' : 'Clear'}
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <MedicationInstructionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productId={item.productId}
          productName={item.product.name}
          initialValue={item.medicationInstruction || undefined}
          onSave={(inst) =>
            dispatch(
              setItemMedicationInstruction({
                productId: item.productId,
                instruction: inst,
              })
            )
          }
        />
      )}
    </div>
  );
};
