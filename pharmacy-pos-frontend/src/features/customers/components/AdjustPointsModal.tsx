import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdjustLoyaltyPoints } from '../hooks/useLoyalty.js';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Sparkles, AlertCircle } from 'lucide-react';

export interface AdjustPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  currentPoints: number;
}

export const AdjustPointsModal: React.FC<AdjustPointsModalProps> = ({
  isOpen,
  onClose,
  customerId,
  customerName,
  currentPoints,
}) => {
  const { t } = useTranslation();
  const [pointsDelta, setPointsDelta] = useState('');
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const adjustMutation = useAdjustLoyaltyPoints();

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const pointsNum = parseInt(pointsDelta, 10);
    if (isNaN(pointsNum) || pointsNum === 0) {
      setErrorMessage('يرجى إدخال عدد نقاط صحيح وموجب أو سالب (غير الصفر)');
      return;
    }

    if (!reason.trim()) {
      setErrorMessage('يرجى كتابة سبب التعديل اليدوي للنقاط للتدقيق');
      return;
    }

    try {
      await adjustMutation.mutateAsync({
        customerId,
        payload: {
          points: pointsNum,
          reason: reason.trim(),
        },
      });
      onClose();
      setPointsDelta('');
      setReason('');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || t('common.unexpectedError'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تعديل رصيد نقاط الولاء يدوياً"
    >
      <form onSubmit={handleAdjust} className="space-y-4 text-xs">
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] flex justify-between items-center">
          <div>
            <p className="text-[11px] text-slate-400">العميل</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">{customerName}</p>
          </div>
          <div className="text-end">
            <p className="text-[11px] text-slate-400">الرصيد الحالي</p>
            <p className="font-bold text-amber-600 font-mono">{currentPoints} نقطة</p>
          </div>
        </div>

        <div>
          <Input
            type="number"
            label="النقاط المراد إضافتها أو خصمها *"
            placeholder="مثال: 50 (للإضافة) أو -20 (للخصم)"
            value={pointsDelta}
            onChange={(e) => setPointsDelta(e.target.value)}
            leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
            required
          />
          <p className="text-[10px] text-slate-400 mt-1">
            أدخل رقماً موجباً لإضافة نقاط، أو رقماً سالباً لخصم نقاط من حساب العميل.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
            سبب التعديل اليدوي (إجباري للتدقيق) *
          </label>
          <textarea
            rows={3}
            placeholder="اكتب مبرر التعديل اليدوي، مثلاً: تعويض عن شكوى، هدية ترويجية، تصحيح خطأ..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full rounded-2xl border p-3 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
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
            isLoading={adjustMutation.isPending}
          >
            تأكيد تعديل النقاط
          </Button>
        </div>
      </form>
    </Modal>
  );
};
