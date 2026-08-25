import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSaleReturn } from '../hooks/useReturns.js';
import { formatDate, formatCurrency } from '../../../lib/utils.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { ReturnReceiptPreview } from '../components/ReturnReceiptPreview.js';
import {
  RotateCcw,
  Printer,
  ArrowRight,
  ArrowLeft,
  User,
  Receipt,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const ReturnDetailsPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { direction } = useAppSelector((state) => state.ui);

  const { data: saleReturn, isLoading, isError } = useSaleReturn(id);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (isError || !saleReturn) {
    return (
      <EmptyState
        icon={RotateCcw}
        title="إشعار الإرجاع غير موجود"
        description="لم يتم العثور على سجل الإرجاع المطلوب."
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            to="/returns"
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                إشعار إرجاع #{saleReturn.returnNumber}
              </h1>
              <Badge variant="coral">مسترجع</Badge>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {formatDate(saleReturn.createdAt)} • المسؤول: {saleReturn.processedByName}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="md"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={() => window.print()}
        >
          طباعة إشعار الإرجاع
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">بيانات الفاتورة والعميل</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5 text-xs">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-sky-600" />
              <div>
                <p className="text-[10px] text-slate-400">الفاتورة الأصلية</p>
                <Link
                  to={`/sales/${saleReturn.saleId}`}
                  className="font-bold text-sky-600 dark:text-sky-400 hover:underline font-mono"
                >
                  {saleReturn.invoiceNumber}
                </Link>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-[#1E293B] flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400">العميل</p>
                <p className="font-bold">{saleReturn.customerName || 'عميل نقدي'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">بيانات الاسترداد المالي</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">المجموع المسترد:</span>
              <span className="font-bold">{formatCurrency(saleReturn.subtotal)}</span>
            </div>
            {saleReturn.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">تسوية الضريبة:</span>
                <span className="font-bold">+{formatCurrency(saleReturn.tax)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1.5 border-t border-slate-100 dark:border-[#1E293B]">
              <span className="font-black text-slate-900 dark:text-white">إجمالي المبلغ المسترد:</span>
              <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                {formatCurrency(saleReturn.total)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">سبب الاسترجاع والملاحظات</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <p className="text-[10px] text-slate-400">السبب المسجل</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {saleReturn.reason || 'بدون سبب مسجل'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <CardTitle className="text-base">الأصناف المسترجعة إلى المخزن</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4 text-start">الدواء / الصنف</th>
                  <th className="py-3.5 px-4 text-start">الباركود</th>
                  <th className="py-3.5 px-4 text-start">التشغيلة (Batch)</th>
                  <th className="py-3.5 px-4 text-start">الكمية المسترجعة</th>
                  <th className="py-3.5 px-4 text-end">المبلغ المسترد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {saleReturn.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {item.productName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {item.barcode || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                      {item.batchNumber || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {item.quantity} عبوة
                    </td>
                    <td className="py-3.5 px-4 text-end font-black text-rose-600 dark:text-rose-400 text-sm">
                      {formatCurrency(item.refundAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Hidden print container for credit note receipt */}
      <div className="hidden print:block">
        <ReturnReceiptPreview saleReturn={saleReturn} />
      </div>
    </div>
  );
};
