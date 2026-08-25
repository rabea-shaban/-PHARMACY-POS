import React from 'react';
import { useTranslation } from 'react-i18next';
import { CustomerPurchaseItem } from '../types/customer.types.js';
import { formatDate, formatCurrency } from '../../../lib/utils.js';
import { Badge } from '../../../components/ui/Badge.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { ReceiptText, Eye, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CustomerPurchaseHistoryProps {
  purchases: CustomerPurchaseItem[];
  isLoading: boolean;
}

export const CustomerPurchaseHistory: React.FC<CustomerPurchaseHistoryProps> = ({
  purchases,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="rounded-3xl shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
        <div className="flex items-center gap-2">
          <ReceiptText className="w-4 h-4 text-sky-600" />
          <CardTitle className="text-sm">سجل فواتير المشتريات السابقة للعميل</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="p-8 text-center">
            <EmptyState
              icon={ShoppingBag}
              title="لا توجد مشتريات مسجلة"
              description="لم يقم العميل بإجراء أي عمليات شراء مسجلة بالفواتير بعد."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">رقم الفاتورة</th>
                  <th className="py-3 px-4 text-start">تاريخ البيع</th>
                  <th className="py-3 px-4 text-start">المجموع الفرعي</th>
                  <th className="py-3 px-4 text-start">الخصم</th>
                  <th className="py-3 px-4 text-start">إجمالي الفاتورة</th>
                  <th className="py-3 px-4 text-start">الحالة</th>
                  <th className="py-3 px-4 text-end">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {p.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {formatDate(p.saleDate)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {formatCurrency(p.subtotal)}
                    </td>
                    <td className="py-3 px-4 text-rose-600 font-bold">
                      {p.discount > 0 ? `-${formatCurrency(p.discount)}` : '—'}
                    </td>
                    <td className="py-3 px-4 font-black text-sky-600 dark:text-sky-400">
                      {formatCurrency(p.total)}
                    </td>
                    <td className="py-3 px-4">
                      {p.status === 'COMPLETED' ? (
                        <Badge variant="success">مكتملة</Badge>
                      ) : p.status === 'CANCELLED' ? (
                        <Badge variant="danger">ملغاة</Badge>
                      ) : p.status === 'RETURNED' ? (
                        <Badge variant="coral">مرتجع</Badge>
                      ) : (
                        <Badge variant="neutral">{p.status}</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Link
                        to={`/sales/${p.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-[#223049] hover:bg-sky-50 dark:hover:bg-[#1E293B] text-sky-600 dark:text-sky-400 font-bold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('common.view')}</span>
                      </Link>
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
