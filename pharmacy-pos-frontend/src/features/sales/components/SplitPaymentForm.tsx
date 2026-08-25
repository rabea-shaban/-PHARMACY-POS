import React from 'react';
import { PaymentEntry } from '../types/checkout.types.js';
import { PaymentMethod } from '../types/sale.types.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Trash2, Banknote, CreditCard, Smartphone, HelpCircle } from 'lucide-react';

export interface SplitPaymentFormProps {
  payments: PaymentEntry[];
  totalDue: number;
  onAddPayment: (entry: PaymentEntry) => void;
  onRemovePayment: (id: string) => void;
  onUpdatePayment: (id: string, field: keyof PaymentEntry, value: any) => void;
}

export const SplitPaymentForm: React.FC<SplitPaymentFormProps> = ({
  payments,
  totalDue,
  onAddPayment,
  onRemovePayment,
  onUpdatePayment,
}) => {

  const totalPaid = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const remaining = Math.max(0, totalDue - totalPaid);
  const changeDue = Math.max(0, totalPaid - totalDue);

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'CASH':
        return <Banknote className="w-4 h-4 text-emerald-600" />;
      case 'VISA':
        return <CreditCard className="w-4 h-4 text-sky-600" />;
      case 'WALLET':
        return <Smartphone className="w-4 h-4 text-amber-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleAddSplit = (method: PaymentMethod) => {
    if (remaining <= 0) return;
    onAddPayment({
      id: Math.random().toString(36).substring(2, 9),
      paymentMethod: method,
      amount: Number(remaining.toFixed(2)),
      referenceNumber: '',
      notes: '',
    });
  };

  return (
    <div className="space-y-4">
      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleAddSplit('CASH')}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
        >
          <Banknote className="w-4 h-4 text-emerald-600" />
          <span>نقدي (كاش)</span>
        </button>

        <button
          type="button"
          onClick={() => handleAddSplit('VISA')}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-sky-950/40 flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-sky-600" />
          <span>فيزا / كارت</span>
        </button>

        <button
          type="button"
          onClick={() => handleAddSplit('WALLET')}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-amber-600" />
          <span>محفظة إلكترونية</span>
        </button>
      </div>

      {/* Payment Records List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {payments.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] text-xs"
          >
            <div className="p-2 rounded-xl bg-white dark:bg-[#131B2A] border border-slate-100 dark:border-[#1E293B] shrink-0">
              {getMethodIcon(p.paymentMethod)}
            </div>

            <div className="w-28 shrink-0">
              <select
                value={p.paymentMethod}
                onChange={(e) =>
                  onUpdatePayment(p.id, 'paymentMethod', e.target.value as PaymentMethod)
                }
                className="w-full rounded-xl border py-1.5 px-2 bg-white dark:bg-[#131B2A] border-slate-200 dark:border-[#223049] text-xs font-bold"
              >
                <option value="CASH">نقدي (Cash)</option>
                <option value="VISA">فيزا (Visa/Master)</option>
                <option value="WALLET">محفظة (Wallet)</option>
                <option value="OTHER">أخرى (Other)</option>
              </select>
            </div>

            <div className="flex-1">
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={p.amount}
                onChange={(e) =>
                  onUpdatePayment(p.id, 'amount', parseFloat(e.target.value) || 0)
                }
                className="w-full rounded-xl border py-1.5 px-2 bg-white dark:bg-[#131B2A] border-slate-200 dark:border-[#223049] text-xs font-black text-sky-600 dark:text-sky-400"
              />
            </div>

            {p.paymentMethod !== 'CASH' && (
              <div className="w-32">
                <input
                  type="text"
                  placeholder="رقم العملية / المرجع"
                  value={p.referenceNumber || ''}
                  onChange={(e) =>
                    onUpdatePayment(p.id, 'referenceNumber', e.target.value)
                  }
                  className="w-full rounded-xl border py-1.5 px-2 bg-white dark:bg-[#131B2A] border-slate-200 dark:border-[#223049] text-[11px]"
                />
              </div>
            )}

            {payments.length > 1 && (
              <button
                type="button"
                onClick={() => onRemovePayment(p.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Financial Status Comparison (Paid / Remaining / Change) */}
      <div className="p-3 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-900/50 space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">الإجمالي المستحق:</span>
          <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(totalDue)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">إجمالي المدفوع:</span>
          <span className="font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalPaid)}
          </span>
        </div>
        {remaining > 0 ? (
          <div className="flex justify-between text-rose-600 font-bold">
            <span>المبلغ المتبقي:</span>
            <span>{formatCurrency(remaining)}</span>
          </div>
        ) : changeDue > 0 ? (
          <div className="flex justify-between text-sky-600 dark:text-sky-400 font-black">
            <span>الباقي للعميل (الفكة):</span>
            <span>{formatCurrency(changeDue)}</span>
          </div>
        ) : (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>حالة الدفع:</span>
            <span>مدفوع بالكامل ومضبوط ✓</span>
          </div>
        )}
      </div>
    </div>
  );
};
