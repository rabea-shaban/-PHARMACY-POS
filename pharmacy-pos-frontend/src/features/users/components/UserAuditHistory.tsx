import React from 'react';
import { useUserAuditLogs } from '../hooks/useUsers.js';
import { formatDate } from '../../../lib/utils.js';
import { Badge } from '../../../components/ui/Badge.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { ShieldCheck, History } from 'lucide-react';

export interface UserAuditHistoryProps {
  userId: string;
}

export const UserAuditHistory: React.FC<UserAuditHistoryProps> = ({ userId }) => {
  const { data, isLoading } = useUserAuditLogs({
    userId,
    limit: 10,
  });

  const logs = data?.items || [];

  return (
    <Card className="rounded-3xl shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-sky-600" />
          <CardTitle className="text-sm">سجل نشاط وحركات الموظف (Audit Trail)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-full bg-slate-100 dark:bg-[#0B0F17] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center">
            <EmptyState
              icon={ShieldCheck}
              title="لا توجد أنشطة مسجلة"
              description="لم يتم تسجيل أي عمليات أو حركات أمنية لهذا الموظف حتى الآن."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-[#0B0F17]/70 border-b border-slate-100 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 text-start">التاريخ والوقت</th>
                  <th className="py-3 px-4 text-start">العملية / الإجراء</th>
                  <th className="py-3 px-4 text-start">المورد (Resource)</th>
                  <th className="py-3 px-4 text-start">عنوان IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1C273B]/50">
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      <Badge variant="purple">{log.action}</Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {log.resource} {log.resourceId ? `#${log.resourceId.slice(0, 8)}` : ''}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {log.ipAddress || '—'}
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
