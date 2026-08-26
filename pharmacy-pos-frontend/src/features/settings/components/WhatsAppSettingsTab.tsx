import React, { useState } from 'react';
import { useWhatsAppMessages, useRetryWhatsAppMessage } from '../hooks/useSettings.js';
import { WhatsAppStatus } from '../types/settings.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { formatDateTime } from '../../../lib/utils.js';
import {
  MessageSquare,
  Send,
  RotateCcw,
  AlertCircle,
  Clock,
  Search,
  CheckCheck,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const WhatsAppSettingsTab: React.FC = () => {
  const [phoneFilter, setPhoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<WhatsAppStatus | ''>('');
  const [page, setPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const queryParams = {
    page,
    limit: 10,
    phone: phoneFilter || undefined,
    status: (statusFilter as WhatsAppStatus) || undefined,
  };

  const { data, isLoading, refetch } = useWhatsAppMessages(queryParams);
  const retryMutation = useRetryWhatsAppMessage();

  const handleRetry = (id: string) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    retryMutation.mutate(id, {
      onSuccess: () => {
        setSuccessMessage('تمت إعادة جدولة وإرسال رسالة الواتساب بنجاح');
      },
      onError: (err: any) => {
        setErrorMessage(err?.response?.data?.message || 'فشلت إعادة إرسال الرسالة');
      },
    });
  };

  const getStatusBadge = (status: WhatsAppStatus) => {
    switch (status) {
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-400">
            <Send className="w-3 h-3" />
            <span>تم الإرسال (Sent)</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCheck className="w-3 h-3" />
            <span>تم التسليم (Delivered)</span>
          </span>
        );
      case 'READ':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400">
            <CheckCheck className="w-3 h-3 text-sky-500" />
            <span>تمت القراءة (Read)</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400">
            <AlertCircle className="w-3 h-3" />
            <span>فشل الإرسال (Failed)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
            <Clock className="w-3 h-3" />
            <span>قيد المعالجة (Pending)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Gateway Status Banner */}
      <Card className="p-4 rounded-3xl bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-300 dark:border-emerald-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>بوابة إشعارات الواتساب الرسمية (WhatsApp Notifications Gateway)</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  نشطة ومتصلة
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                إرسال فواتير المبيعات الإلكترونية للعملاء، تنبيهات استبدال النقاط، وإشعارات جاهزية الأدوية
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            تحديث السجل
          </Button>
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card className="p-4 rounded-3xl shadow-xs border-slate-200/80 dark:border-[#1E293B]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="بحث برقم الهاتف..."
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as WhatsAppStatus | '')}
            className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-hidden"
          >
            <option value="">كافة حالات الرسائل (All Statuses)</option>
            <option value="SENT">تم الإرسال (Sent)</option>
            <option value="DELIVERED">تم التسليم (Delivered)</option>
            <option value="READ">تمت القراءة (Read)</option>
            <option value="FAILED">فشل الإرسال (Failed)</option>
            <option value="PENDING">قيد المعالجة (Pending)</option>
          </select>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => {
              setPhoneFilter('');
              setStatusFilter('');
            }}
          >
            إعادة تعيين الفلاتر
          </Button>
        </div>
      </Card>

      {/* WhatsApp Message Log Table */}
      <Card className="rounded-3xl shadow-xs overflow-hidden border-slate-200/80 dark:border-[#1E293B]">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                سجل رسائل الواتساب المرسلة للعملاء
              </CardTitle>
            </div>
            {data?.pagination && (
              <span className="text-xs font-mono text-slate-500">
                إجمالي: {data.pagination.total} رسالة
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
              جاري تحميل سجل رسائل الواتساب...
            </div>
          ) : !data?.items || data.items.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p>لا توجد رسائل واتساب مسجلة حتى الآن</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="py-3 px-4 text-start">العميل / الهاتف</th>
                    <th className="py-3 px-4 text-start">الفاتورة المرتبطة</th>
                    <th className="py-3 px-4 text-start">نص الرسالة</th>
                    <th className="py-3 px-4 text-center">حالة الإرسال</th>
                    <th className="py-3 px-4 text-start">التاريخ والوقت</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                  {data.items.map((msg) => (
                    <tr key={msg.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {msg.customerName || 'عميل صيدلية'}
                        </p>
                        <p className="font-mono text-[11px] text-slate-500 mt-0.5">{msg.phone}</p>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-sky-600">
                        {msg.saleInvoiceNumber ? `#${msg.saleInvoiceNumber}` : '—'}
                      </td>

                      <td className="py-3 px-4 max-w-xs truncate text-slate-700 dark:text-slate-300">
                        {msg.message}
                      </td>

                      <td className="py-3 px-4 text-center">{getStatusBadge(msg.status)}</td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {formatDateTime(msg.createdAt)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {msg.status === 'FAILED' ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetry(msg.id)}
                            isLoading={retryMutation.isPending}
                            leftIcon={<RotateCcw className="w-3 h-3" />}
                            className="text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            إعادة الإرسال
                          </Button>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                السابق
              </Button>

              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
                صفحة {data.pagination.page} من {data.pagination.totalPages}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                التالي
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
