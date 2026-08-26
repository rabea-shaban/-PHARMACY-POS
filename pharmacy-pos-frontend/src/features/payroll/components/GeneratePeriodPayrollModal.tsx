import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGeneratePeriodPayroll } from '../hooks/usePayroll.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Calendar, Coins, AlertCircle, Sparkles } from 'lucide-react';

export interface GeneratePeriodPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeneratePeriodPayrollModal: React.FC<GeneratePeriodPayrollModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const [periodStart, setPeriodStart] = useState(firstDay);
  const [periodEnd, setPeriodEnd] = useState(lastDay);
  const [defaultBaseSalary, setDefaultBaseSalary] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generatePeriodMutation = useGeneratePeriodPayroll();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await generatePeriodMutation.mutateAsync({
        periodStart,
        periodEnd,
        defaultBaseSalary: defaultBaseSalary ? Number(defaultBaseSalary) : undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="توليد مسير الرواتب الشهري لجميع الموظفين"
    >
      <form onSubmit={handleGenerate} className="space-y-4 text-xs">
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-3 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/50 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-sky-900 dark:text-sky-200 leading-relaxed">
            سيقوم النظام بحساب مستحقات جميع الصيادلة والموظفين النشطين عن الفترة المحددة، مع جلب العمولات المكتسبة آلياً.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Input
              type="date"
              label="بداية الفترة *"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
              required
            />
          </div>

          <div>
            <Input
              type="date"
              label="نهاية الفترة *"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
              required
            />
          </div>
        </div>

        <div>
          <Input
            type="number"
            step="any"
            label="الراتب الأساسي الافتراضي للموظفين الجدد (اختياري)"
            placeholder="مثال: 5000"
            value={defaultBaseSalary || ''}
            onChange={(e) => setDefaultBaseSalary(e.target.value ? Number(e.target.value) : undefined)}
            leftIcon={<Coins className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1E293B]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {t('common.cancel')}
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={generatePeriodMutation.isPending}
          >
            توليد المسير الجماعي
          </Button>
        </div>
      </form>
    </Modal>
  );
};
