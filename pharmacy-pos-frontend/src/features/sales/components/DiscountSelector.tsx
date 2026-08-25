import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../../store/hooks.js';
import { setDiscount } from '../../../store/slices/cartSlice.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Tag, Percent, DollarSign, X } from 'lucide-react';

export const DiscountSelector: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const appliedDiscount = useAppSelector((state) => state.cart.discount);

  const [isOpen, setIsOpen] = useState(false);
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountCode, setDiscountCode] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountValue <= 0) return;

    dispatch(
      setDiscount({
        code: discountCode.trim() || undefined,
        type: discountType,
        value: discountValue,
        name: discountCode ? `كوبون: ${discountCode}` : `${discountValue}${discountType === 'PERCENTAGE' ? '%' : ' ج.م'}`,
      })
    );
    setIsOpen(false);
  };

  const handleRemove = () => {
    dispatch(setDiscount(null));
    setDiscountValue(0);
    setDiscountCode('');
  };

  return (
    <>
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F17]/60 border border-slate-100 dark:border-[#1E293B] text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400">
            <Tag className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-200 block truncate">
              {appliedDiscount ? appliedDiscount.name || 'خصم مطبق' : t('pos.noDiscountApplied') || 'بدون خصم'}
            </span>
          </div>
        </div>

        {appliedDiscount ? (
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="إلغاء الخصم"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold hover:bg-amber-200 transition-colors cursor-pointer text-[11px]"
          >
            {t('pos.addDiscount') || 'إضافة خصم'}
          </button>
        )}
      </div>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={t('pos.discountModalTitle') || 'تطبيق خصم أو كوبون'}
        >
          <form onSubmit={handleApply} className="space-y-4 text-xs">
            {/* Discount Type Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDiscountType('PERCENTAGE')}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  discountType === 'PERCENTAGE'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#1C273B] text-slate-600 dark:text-slate-300'
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>نسبة مئوية (%)</span>
              </button>

              <button
                type="button"
                onClick={() => setDiscountType('FIXED')}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  discountType === 'FIXED'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#1C273B] text-slate-600 dark:text-slate-300'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>مبلغ ثابت (ج.م)</span>
              </button>
            </div>

            {/* Value Input */}
            <Input
              label={discountType === 'PERCENTAGE' ? 'نسبة الخصم (%)' : 'مبلغ الخصم (ج.م)'}
              type="number"
              min="0.1"
              max={discountType === 'PERCENTAGE' ? 100 : 10000}
              step="0.1"
              value={discountValue || ''}
              onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
              required
              autoFocus
            />

            {/* Optional Coupon Code */}
            <Input
              label="كود الكوبون / كود الخصم (اختياري)"
              placeholder="مثال: SUMMER10"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1E293B]">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" variant="primary">
                {t('common.save')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
