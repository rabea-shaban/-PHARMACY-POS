import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/Button.js';
import { AlertCircle, Save, RotateCcw } from 'lucide-react';

export interface SettingsSaveBarProps {
  isDirty: boolean;
  isLoading: boolean;
  onSave: () => void;
  onReset: () => void;
}

export const SettingsSaveBar: React.FC<SettingsSaveBarProps> = ({
  isDirty,
  isLoading,
  onSave,
  onReset,
}) => {
  const { t } = useTranslation();

  if (!isDirty) return null;

  return (
    <div className="fixed bottom-6 inset-x-0 z-30 max-w-2xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900/95 dark:bg-[#1E293B]/95 text-white shadow-2xl backdrop-blur-md border border-slate-700/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold truncate">
            يوجد تعديلات غير محفوظة، اضغط حفظ لتطبيقها في النظام
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isLoading}
            className="text-slate-300 border-slate-600 hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('common.cancel')}</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onSave}
            isLoading={isLoading}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            {t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};
