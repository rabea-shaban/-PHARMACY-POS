import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../../store/hooks.js';
import { setLoyaltyRedemption } from '../../../store/slices/cartSlice.js';
import { Sparkles } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils.js';

export const LoyaltySummary: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.cart.customer);
  const loyaltyRedemption = useAppSelector((state) => state.cart.loyalty);
  const subtotal = useAppSelector((state) => state.cart.subtotal);

  const availablePoints = customer?.loyaltyAccount?.totalPoints ?? customer?.loyalty?.points ?? 0;
  // Standard conversion: 10 points = 1 EGP discount
  const maxRedeemableDiscount = Math.min(subtotal, availablePoints / 10);

  if (!customer || availablePoints <= 0) return null;

  const handleToggleRedeem = () => {
    if (loyaltyRedemption) {
      dispatch(setLoyaltyRedemption(null));
    } else {
      const pointsToUse = Math.floor(maxRedeemableDiscount * 10);
      dispatch(
        setLoyaltyRedemption({
          pointsToRedeem: pointsToUse,
          discountAmount: Number((pointsToUse / 10).toFixed(2)),
        })
      );
    }
  };

  return (
    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 text-xs">
      <div className="flex items-center gap-2 min-w-0">
        <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="font-bold text-emerald-900 dark:text-emerald-200 block truncate">
            {loyaltyRedemption
              ? `تم استبدال ${loyaltyRedemption.pointsToRedeem} نقطة (-${formatCurrency(loyaltyRedemption.discountAmount)})`
              : `نقاط الولاء المتاحة: ${availablePoints} نقطة`}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleToggleRedeem}
        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
          loyaltyRedemption
            ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-300'
            : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
        }`}
      >
        {loyaltyRedemption ? t('common.cancel') : t('pos.redeemPoints') || 'استبدال بالخصم'}
      </button>
    </div>
  );
};
