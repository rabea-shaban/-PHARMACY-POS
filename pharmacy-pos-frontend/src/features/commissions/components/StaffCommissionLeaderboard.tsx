import React from 'react';
import { useTranslation } from 'react-i18next';
import { StaffCommissionSummaryItem } from '../types/commission.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Trophy, Award, User, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface StaffCommissionLeaderboardProps {
  staffSummary: StaffCommissionSummaryItem[];
}

export const StaffCommissionLeaderboard: React.FC<StaffCommissionLeaderboardProps> = ({
  staffSummary,
}) => {
  const { t } = useTranslation();

  if (!staffSummary || staffSummary.length === 0) return null;

  // Sort descending by totalCommissions
  const sorted = [...staffSummary].sort((a, b) => b.totalCommissions - a.totalCommissions);

  return (
    <Card className="rounded-3xl shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <CardTitle className="text-sm">لوحة تميز وحوافز الصيادلة (Commission Leaderboard)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 dark:divide-[#1E293B]">
          {sorted.map((staff, idx) => (
            <div
              key={staff.userId}
              className="p-4 flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50 transition-colors text-xs"
            >
              {/* Rank & Staff */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs font-mono shrink-0 ${
                    idx === 0
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                      : idx === 1
                      ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                      : idx === 2
                      ? 'bg-amber-800/10 text-amber-900 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400'
                  }`}
                >
                  {idx + 1}
                </div>

                <div>
                  <Link
                    to={`/users/${staff.userId}`}
                    className="font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{staff.userName}</span>
                  </Link>
                  <span className="text-[11px] text-slate-400 font-bold block mt-0.5">
                    {staff.userRole}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-end">
                <div>
                  <span className="text-[11px] text-slate-400 flex items-center justify-end gap-1 font-bold">
                    <ShoppingBag className="w-3 h-3 text-slate-400" />
                    <span>فواتير البيع</span>
                  </span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 mt-0.5 block">
                    {staff.salesCount} فاتورة
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 flex items-center justify-end gap-1 font-bold">
                    <Award className="w-3 h-3 text-amber-500" />
                    <span>إجمالي العمولة</span>
                  </span>
                  <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center justify-end gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5 inline" />
                    +{formatCurrency(staff.totalCommissions)} {t('common.currency')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
