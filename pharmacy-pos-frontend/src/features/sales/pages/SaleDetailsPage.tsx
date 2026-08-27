import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { useSale, useCancelSale } from '../hooks/useSales.js';
import { SaleStatus } from '../types/sale.types.js';
import { formatDate, formatCurrency } from '../../../lib/utils.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { showPromptDialog } from '../../../lib/alerts.js';
import { ReceiptPreview } from '../components/ReceiptPreview.js';
import {
  ReceiptText,
  Printer,
  XCircle,
  ArrowRight,
  ArrowLeft,
  User,
  CreditCard,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const SaleDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id = '' } = useParams<{ id: string }>();
  const { direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);

  const { data: sale, isLoading, isError } = useSale(id);
  const cancelMutation = useCancelSale();

  const canCancel = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  const handleCancelSale = async () => {
    const reason = await showPromptDialog({
      title: 'إلغاء فاتورة البيع',
      text: 'يرجى إدخال سبب إلغاء فاتورة البيع:',
      placeholder: 'سبب الإلغاء (3 أحرف على الأقل)...',
      confirmButtonText: 'تأكيد الإلغاء',
      cancelButtonText: 'تراجع',
      inputValidator: (val) => (val.trim().length < 3 ? 'يجب إدخال 3 أحرف على الأقل للسبب' : null),
    });
    if (reason && reason.trim().length >= 3) {
      await cancelMutation.mutateAsync({ id, reason: reason.trim() });
    }
  };

  const getStatusBadge = (st: SaleStatus) => {
    switch (st) {
      case 'COMPLETED':
        return <Badge variant="success">مكتملة</Badge>;
      case 'DRAFT':
        return <Badge variant="warning">مسودة</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">ملغاة</Badge>;
      case 'PARTIALLY_RETURNED':
        return <Badge variant="purple">مرتجع جزئي</Badge>;
      case 'RETURNED':
        return <Badge variant="coral">مرتجع كامل</Badge>;
      default:
        return <Badge variant="neutral">{st}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (isError || !sale) {
    return (
      <EmptyState
        icon={ReceiptText}
        title="فاتورة البيع غير موجودة"
        description="لم يتم العثور على الفاتورة المطلوبة أو ربما تم حذفها."
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            to="/sales"
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                فاتورة مبيعات #{sale.invoiceNumber}
              </h1>
              {getStatusBadge(sale.status)}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {formatDate(sale.createdAt)} • الكاشير: {sale.cashierName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            {t('pos.printReceipt') || 'طباعة الإيصال'}
          </Button>

          {sale.status === 'COMPLETED' && canCancel && (
            <Button
              variant="danger"
              size="md"
              leftIcon={<XCircle className="w-4 h-4" />}
              onClick={handleCancelSale}
              isLoading={cancelMutation.isPending}
            >
              إلغاء الفاتورة
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer & Staff Info */}
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">بيانات العميل والكاشير</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <User className="w-4 h-4 text-sky-600" />
              <div>
                <p className="text-[10px] text-slate-400">العميل</p>
                <p className="font-bold">{sale.customerName || 'عميل نقدي'}</p>
              </div>
            </div>

            {sale.customerPhone && (
              <p className="text-slate-500 font-mono text-[11px]">
                الهاتف: {sale.customerPhone}
              </p>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-[#1E293B]">
              <p className="text-[10px] text-slate-400">الكاشير المسجل</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">{sale.cashierName}</p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">البيانات المالية والخصومات</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">المجموع الفرعي:</span>
              <span className="font-bold">{formatCurrency(sale.subtotal)}</span>
            </div>

            {sale.discount > 0 && (
              <div className="flex justify-between text-rose-600 font-bold">
                <span>
                  الخصم المطبق ({sale.subtotal > 0 ? ((sale.discount / sale.subtotal) * 100).toFixed(1).replace(/\.0$/, '') : 0}%):
                </span>
                <span>-{formatCurrency(sale.discount)}</span>
              </div>
            )}

            {sale.insuranceAmount > 0 && (
              <div className="flex justify-between text-teal-600 font-bold">
                <span>تغطية التأمين:</span>
                <span>-{formatCurrency(sale.insuranceAmount)}</span>
              </div>
            )}

            {sale.tax > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>الضريبة:</span>
                <span>+{formatCurrency(sale.tax)}</span>
              </div>
            )}

            <div className="flex justify-between pt-1.5 border-t border-slate-100 dark:border-[#1E293B]">
              <span className="font-black text-slate-900 dark:text-white">الإجمالي النهائي:</span>
              <span className="font-black text-sky-600 dark:text-sky-400 text-sm">
                {formatCurrency(sale.total)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payments Summary */}
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">سجل المدفوعات والتحصيل</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            {sale.payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#0B0F17]"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold">{p.paymentMethod}</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">
                  {formatCurrency(p.amount)}
                </span>
              </div>
            ))}

            {sale.notes && (
              <div className="pt-2 border-t border-slate-100 dark:border-[#1E293B]">
                <p className="text-[10px] text-slate-400">ملاحظات الفاتورة</p>
                <p className="text-slate-600 dark:text-slate-300 italic">{sale.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice Items Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <CardTitle className="text-base">الأصناف المبيعة والتشغيلات (FEFO)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4 text-start">الدواء / الصنف</th>
                  <th className="py-3.5 px-4 text-start">الباركود</th>
                  <th className="py-3.5 px-4 text-start">التشغيلة (Batch)</th>
                  <th className="py-3.5 px-4 text-start">الكمية</th>
                  <th className="py-3.5 px-4 text-start">سعر الوحدة</th>
                  <th className="py-3.5 px-4 text-end">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {sale.items.map((item) => (
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
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-end font-black text-sky-600 dark:text-sky-400 text-sm">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Hidden container that prints ONLY the receipt in @media print */}
      <div className="hidden print:block">
        <ReceiptPreview sale={sale} />
      </div>
    </div>
  );
};
