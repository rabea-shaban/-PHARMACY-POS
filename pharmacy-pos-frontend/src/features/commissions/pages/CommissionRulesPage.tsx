import React, { useState } from 'react';
import {
  useCommissionRules,
  useUpdateCommissionRule,
} from '../hooks/useCommissions.js';
import { CommissionRulesTable } from '../components/CommissionRulesTable.js';
import { CreateRuleModal } from '../components/CreateRuleModal.js';
import { EditRuleModal } from '../components/EditRuleModal.js';
import { CommissionRule } from '../types/commission.types.js';
import { Button } from '../../../components/ui/Button.js';
import { Card } from '../../../components/ui/Card.js';
import { EmptyState } from '../../../components/common/EmptyState.js';
import { Sparkles, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';

export const CommissionRulesPage: React.FC = () => {
  const { direction } = useAppSelector((state) => state.ui);
  const { role } = useAppSelector((state) => state.auth);
  const canManage = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);

  const { data: rules = [], isLoading } = useCommissionRules();
  const updateMutation = useUpdateCommissionRule();

  const handleToggleStatus = async (rule: CommissionRule) => {
    const action = rule.isActive ? 'تعطيل' : 'تفعيل';
    if (window.confirm(`هل أنت متأكد من ${action} قاعدة العمولة (${rule.name})؟`)) {
      await updateMutation.mutateAsync({
        id: rule.id,
        data: { isActive: !rule.isActive },
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            to="/commissions"
            className="p-2 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] transition-colors"
          >
            {direction === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span>قواعد وسياسات العمولات (Commission Rules)</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تحديد النسب المئوية والمبالغ الثابتة لحساب عمولات بيع الأدوية
            </p>
          </div>
        </div>

        {canManage && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            إضافة قاعدة جديدة
          </Button>
        )}
      </div>

      {/* Rules Table */}
      {!isLoading && rules.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center">
          <EmptyState
            icon={Sparkles}
            title="لا توجد قواعد عمولات مسجلة"
            description="لم يتم إنشاء أي قواعد لحساب العمولات حتى الآن."
            action={
              canManage ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsCreateOpen(true)}
                >
                  إضافة أول قاعدة عمولة
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <CommissionRulesTable
          rules={rules}
          isLoading={isLoading}
          onEdit={(r) => setEditingRule(r)}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Modals */}
      <CreateRuleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditRuleModal
        isOpen={Boolean(editingRule)}
        onClose={() => setEditingRule(null)}
        rule={editingRule}
      />
    </div>
  );
};
