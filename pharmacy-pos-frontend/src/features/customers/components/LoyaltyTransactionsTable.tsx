import React from 'react';
import { LoyaltyTransactionItem, LoyaltyTransactionType } from '../types/loyalty.types.js';
import { formatDate } from '../../../lib/utils.js';
import { Badge } from '../../../components/ui/Badge.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Sparkles, ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';

export interface LoyaltyTransactionsTableProps {
  transactions: LoyaltyTransactionItem[];
  isLoading: boolean;
}

export const LoyaltyTransactionsTable: React.FC<LoyaltyTransactionsTableProps> = ({
  transactions,
  isLoading,
}) => {

  const getTransactionBadge = (type: LoyaltyTransactionType) => {
    switch (type) {
      case 'EARN':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>اكتساب نقاط</span>
          </span>
        );
      case 'REDEEM':
        return (
          <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>استبدال خصم</span>
          </span>
        );
      case 'ADJUSTMENT':
        return <Badge variant="purple">تعديل يدوي</Badge>;
      case 'EXPIRED':
        return <Badge variant="coral">منتهية الصلاحية</Badge>;
      case 'REVERSAL':
        return <Badge variant="warning">إلغاء / مرتجع</Badge>;
      default:
        return <Badge variant="neutral">{type}</Badge>;
    }
  };

  return (
    <Card className="rounded-3xl shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-sky-600" />
          <CardTitle className="text-sm">سجل حركات نقاط الولاء والمكافآت</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <EmptyState
              icon={Sparkles}
              title="لا توجد حركات نقاط سابقة"
              description="لم يقم العميل باكتساب أو استبدال أي نقاط حتى الآن."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">التاريخ والوقت</th>
                  <th className="py-3 px-4 text-start">نوع الحركة</th>
                  <th className="py-3 px-4 text-start">النقاط</th>
                  <th className="py-3 px-4 text-start">الرصيد بعد الحركة</th>
                  <th className="py-3 px-4 text-start">السبب / المرجع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="py-3 px-4">{getTransactionBadge(tx.type)}</td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span
                        className={
                          tx.points > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }
                      >
                        {tx.points > 0 ? `+${tx.points}` : tx.points}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {tx.balanceAfter} نقطة
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {tx.reason || (tx.referenceId ? `فاتورة #${tx.referenceId.slice(0, 8)}` : '—')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
