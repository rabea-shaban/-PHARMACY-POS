import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { useQuery } from '@tanstack/react-query';
import { transfersApi } from '../../transfers/api/transfersApi.js';
import { ArrowLeftRight, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge.js';

export const BranchTransfersWidget: React.FC = () => {
  const { t } = useTranslation();
  const { data: transfersData, isLoading } = useQuery({
    queryKey: ['transfers', 'widget-list'],
    queryFn: () => transfersApi.getTransfers({ limit: 5 }),
    staleTime: 60 * 1000,
  });

  const transfers = transfersData?.items || [];
  const pendingCount = transfers.filter((tr) => tr.status === 'PENDING' || tr.status === 'APPROVED').length;

  return (
    <Card className="rounded-3xl shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base">{t('dashboard.actionTransfers')}</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {pendingCount > 0
                ? `${pendingCount} ${t('dashboard.pendingTransfers')}`
                : 'متابعة حركة تحويلات المخزون بين الفروع'}
            </p>
          </div>
        </div>

        <Link
          to="/transfers"
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>عرض كل التحويلات</span>
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </Link>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2 py-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-12 bg-slate-100 dark:bg-[#1E293B] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : transfers.length === 0 ? (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
            لا توجد طلبات تحويل مخزني حالياً.
          </div>
        ) : (
          <div className="space-y-2.5">
            {transfers.slice(0, 4).map((tr) => (
              <div
                key={tr.id}
                className="p-3 rounded-2xl border border-slate-200/70 dark:border-[#223049] bg-slate-50/50 dark:bg-[#131B2A] flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                    <span>{tr.fromBranch?.name || 'فرع المصدر'}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 rtl:rotate-180" />
                    <span>{tr.toBranch?.name || 'فرع الوجهة'}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="font-mono">{tr.transferNumber}</span>
                    <span>• {tr.items?.length || 0} أصناف</span>
                  </div>
                </div>

                <div>
                  {tr.status === 'PENDING' && (
                    <Badge variant="warning">
                      <Clock className="w-3 h-3 me-1" />
                      قيد المراجعة
                    </Badge>
                  )}
                  {tr.status === 'APPROVED' && (
                    <Badge variant="info">
                      معتمد
                    </Badge>
                  )}
                  {tr.status === 'IN_TRANSIT' && (
                    <Badge variant="mint">
                      في الطريق
                    </Badge>
                  )}
                  {tr.status === 'RECEIVED' && (
                    <Badge variant="purple">
                      تم الاستلام
                    </Badge>
                  )}
                  {tr.status === 'COMPLETED' && (
                    <Badge variant="success">
                      مكتمل
                    </Badge>
                  )}
                  {tr.status === 'REJECTED' && (
                    <Badge variant="danger">
                      <AlertCircle className="w-3 h-3 me-1" />
                      مرفوض
                    </Badge>
                  )}
                  {tr.status === 'CANCELLED' && (
                    <Badge variant="neutral">
                      ملغي
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
