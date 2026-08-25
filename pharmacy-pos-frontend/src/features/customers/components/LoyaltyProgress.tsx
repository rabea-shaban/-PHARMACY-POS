import React from 'react';
import { CustomerTier } from '../types/customer.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Award, TrendingUp } from 'lucide-react';

export interface LoyaltyProgressProps {
  currentPoints: number;
  currentTier?: CustomerTier | null;
  allTiers: CustomerTier[];
}

export const LoyaltyProgress: React.FC<LoyaltyProgressProps> = ({
  currentPoints,
  currentTier,
  allTiers,
}) => {
  // Sort tiers ascending by minimum points
  const sortedTiers = [...allTiers].sort((a, b) => a.minimumPoints - b.minimumPoints);

  // Find next tier
  const nextTier = sortedTiers.find(
    (t) => t.minimumPoints > (currentTier?.minimumPoints || 0) && t.minimumPoints > currentPoints
  );

  if (!nextTier) {
    return (
      <Card className="rounded-3xl shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <CardTitle className="text-sm">الترقية لأعلى مستوى</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-bold">
            🎉 العميل وصل إلى أعلى فئات الولاء المتاحة في النظام!
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentMin = currentTier?.minimumPoints || 0;
  const targetPoints = nextTier.minimumPoints;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((currentPoints - currentMin) / (targetPoints - currentMin)) * 100))
  );
  const remainingPoints = Math.max(0, targetPoints - currentPoints);

  return (
    <Card className="rounded-3xl shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <CardTitle className="text-sm">التقدم نحو الفئة القادمة</CardTitle>
          </div>
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 font-mono">
            {progressPercent}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3 text-xs">
        {/* Next Tier target */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              الهدف: فئة {nextTier.name}
            </span>
          </div>
          <span className="font-mono text-slate-500 font-bold">
            {targetPoints} نقطة
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-[#0B0F17] rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-[#223049]">
          <div
            className="bg-linear-to-r from-sky-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Remaining Points Note */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          متبقي <strong className="text-sky-600 dark:text-sky-400 font-mono">{remainingPoints}</strong> نقطة للترقية التلقائية والحصول على خصم <strong>{nextTier.discountPercentage}%</strong>.
        </p>
      </CardContent>
    </Card>
  );
};
