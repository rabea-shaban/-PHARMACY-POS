import React, { useState } from 'react';
import { useAuditLogs, useAuditSummary } from '../hooks/useAudit.js';
import { AuditTable } from '../components/AuditTable.js';
import { AuditFilters } from '../components/AuditFilters.js';
import { AuditDetailsModal } from '../components/AuditDetailsModal.js';
import { AuditActivityChart } from '../components/AuditActivityChart.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { AuditLog } from '../types/audit.types.js';
import { ShieldCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.js';

export const AuditLogsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [entity, setEntity] = useState('');
  const [action, setAction] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data, isLoading } = useAuditLogs({
    page,
    limit: 20,
    entity: entity || undefined,
    action: (action as any) || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  const { data: summary } = useAuditSummary({
    from: from || undefined,
    to: to || undefined,
  });

  const logs = data?.items || [];
  const pagination = data?.pagination;

  const handleResetFilters = () => {
    setEntity('');
    setAction('');
    setFrom('');
    setTo('');
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>سجلات التدقيق والأمان (Audit & Security Logs)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مراقبة وتوثيق كافة العمليات، فواتير البيع، التعديلات، وتسجيلات الدخول غير القابلة للتغيير
          </p>
        </div>

        <Link to="/activity">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Activity className="w-4 h-4 text-sky-600" />}
          >
            لوحة النشاط والإحصائيات
          </Button>
        </Link>
      </div>

      {/* Activity Summary Overview */}
      {summary && <AuditActivityChart summary={summary} />}

      {/* Filters */}
      <AuditFilters
        entity={entity}
        onEntityChange={(val) => {
          setEntity(val);
          setPage(1);
        }}
        action={action}
        onActionChange={(val) => {
          setAction(val);
          setPage(1);
        }}
        from={from}
        onFromChange={(val) => {
          setFrom(val);
          setPage(1);
        }}
        to={to}
        onToChange={(val) => {
          setTo(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Audit Table */}
      {!isLoading && logs.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={ShieldCheck}
            title="لا توجد سجلات تدقيق"
            description="لم يتم العثور على أي حركات تدقيق تطابق خيارات الفلترة المحددة."
          />
        </Card>
      ) : (
        <AuditTable
          logs={logs}
          isLoading={isLoading}
          onSelectLog={(log) => setSelectedLog(log)}
          pagination={pagination}
          onPageChange={setPage}
        />
      )}

      {/* Modal Diff */}
      <AuditDetailsModal
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />
    </div>
  );
};
