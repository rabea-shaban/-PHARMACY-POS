import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuditLog } from '../hooks/useAudit.js';
import { AuditActionBadge } from '../components/AuditActionBadge.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { formatDate } from '../../../lib/utils.js';
import { ShieldCheck, User, Clock, Layers, ArrowRight, ArrowLeft, FileCode } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

export const AuditDetailsPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { direction } = useAppSelector((state) => state.ui);

  const { data: log, isLoading, isError } = useAuditLog(id);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 dark:bg-[#131B2A] rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (isError || !log) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="السجل الأمني غير موجود"
        description="لم يتم العثور على سجل التدقيق المطلوب."
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <Link
          to="/audit"
          className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
        >
          {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </Link>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              سجل التدقيق #{log.id.slice(0, 8)}
            </h1>
            <AuditActionBadge action={log.action} />
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">المعرف الكامل: {log.id}</p>
        </div>
      </div>

      {/* Meta Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">معلومات الفاعل والعملية</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-[#0B0F17] text-sky-600 border border-slate-200 dark:border-[#223049]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">المستخدم المسؤول</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {log.userName || 'نظام آلي'} {log.userRole ? `(${log.userRole})` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-[#0B0F17] text-indigo-600 border border-slate-200 dark:border-[#223049]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">تاريخ وتوقيت العملية</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {formatDate(log.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">الكيان المتأثر</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-[#0B0F17] text-purple-600 border border-slate-200 dark:border-[#223049]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">نوع الكيان (Entity)</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {log.entity}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F17] text-slate-500 border border-slate-200 dark:border-[#223049]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-bold">معرف الكيان (Entity ID)</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {log.entityId || '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Changes Before / After */}
      {(log.oldData || log.newData) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="rounded-3xl shadow-xs border-rose-200/80 dark:border-rose-900/50">
            <CardHeader className="pb-2 border-b border-rose-100 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-950/10">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                <FileCode className="w-4 h-4" />
                <CardTitle className="text-sm">البيانات السابقة (Before Changes)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <pre className="text-xs font-mono bg-white dark:bg-[#0B0F17] p-3 rounded-2xl overflow-x-auto max-h-80 border border-slate-200 dark:border-[#223049] text-slate-800 dark:text-slate-200">
                {log.oldData ? JSON.stringify(log.oldData, null, 2) : '— لا توجد بيانات سابقة —'}
              </pre>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-xs border-emerald-200/80 dark:border-emerald-900/50">
            <CardHeader className="pb-2 border-b border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/10">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <FileCode className="w-4 h-4" />
                <CardTitle className="text-sm">البيانات الجديدة (After Changes)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <pre className="text-xs font-mono bg-white dark:bg-[#0B0F17] p-3 rounded-2xl overflow-x-auto max-h-80 border border-slate-200 dark:border-[#223049] text-slate-800 dark:text-slate-200">
                {log.newData ? JSON.stringify(log.newData, null, 2) : '— لا توجد بيانات جديدة —'}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Metadata */}
      {log.metadata && (
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-2 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">بيانات السياق والبيئة (Metadata)</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <pre className="text-xs font-mono bg-slate-50 dark:bg-[#0B0F17] p-3 rounded-2xl overflow-x-auto max-h-48 border border-slate-200 dark:border-[#223049] text-slate-800 dark:text-slate-200">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
