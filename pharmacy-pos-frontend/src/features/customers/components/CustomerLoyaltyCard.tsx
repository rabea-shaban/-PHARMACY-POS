import React from 'react';
import { CustomerTier } from '../types/customer.types.js';
import { LoyaltySummaryResponse } from '../types/loyalty.types.js';
import { CustomerTierBadge } from './CustomerTierBadge.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Sparkles, PlusCircle, ShieldCheck } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export interface CustomerLoyaltyCardProps {
  loyaltySummary?: LoyaltySummaryResponse;
  tier?: CustomerTier | null;
  onOpenAdjustModal?: () => void;
}

export const CustomerLoyaltyCard: React.FC<CustomerLoyaltyCardProps> = ({
  loyaltySummary,
  tier,
  onOpenAdjustModal,
}) => {
  const { role } = useAppSelector((state) => state.auth);
  const canAdjust = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  const totalPoints = loyaltySummary?.loyaltyAccount?.totalPoints || 0;
  const currentTier = loyaltySummary?.tier || tier;

  return (
    <Card className="rounded-3xl shadow-xs bg-linear-to-br from-white via-sky-50/30 to-white dark:from-[#131B2A] dark:via-[#192438]/50 dark:to-[#131B2A] border border-sky-100 dark:border-[#223049]">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-sm">حساب نقاط الولاء والمكافآت</CardTitle>
        </div>

        {canAdjust && onOpenAdjustModal && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenAdjustModal}
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            تعديل الرصيد
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-5 space-y-4 text-xs">
        {/* Points Banner */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] shadow-2xs">
          <div>
            <p className="text-[11px] text-slate-400 font-bold">الرصيد المتاح للاستبدال</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5">
              {totalPoints}{' '}
              <span className="text-xs font-bold text-slate-500">نقطة</span>
            </p>
          </div>

          <div className="text-end">
            <p className="text-[11px] text-slate-400 font-bold mb-1">الفئة الحالية</p>
            <CustomerTierBadge tier={currentTier} />
          </div>
        </div>

        {/* Benefits Breakdown */}
        {currentTier && (
          <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50 space-y-1.5 text-sky-900 dark:text-sky-200">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>مزايا فئة {currentTier.name}:</span>
            </div>
            <p className="text-[11px] ps-5 text-sky-700 dark:text-sky-300">
              • خصم تلقائي دائم بنسبة <strong>{currentTier.discountPercentage}%</strong> على كافة المشتريات.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
