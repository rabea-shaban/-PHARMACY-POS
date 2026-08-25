import React from 'react';
import { formatCurrency } from '../../../lib/utils.js';
import { Button } from '../../../components/ui/Button.js';
import { RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';

export interface RefundSummaryProps {
  itemCount: number;
  totalRefund: number;
  taxAmount: number;
  onConfirm: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const RefundSummary: React.FC<RefundSummaryProps> = ({
  itemCount,
  totalRefund,
  taxAmount,
  onConfirm,
  isLoading,
  disabled,
}) => {

  return (
    <Card className="rounded-3xl shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
        <CardTitle className="text-sm">ملخص الاسترداد المالي</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3 text-xs">
        <div className="flex justify-between text-slate-500">
          <span>عدد الأصناف المسترجعة:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {itemCount} صنف
          </span>
        </div>

        <div className="flex justify-between text-slate-500">
          <span>المجموع المسترد:</span>
          <span className="font-bold">{formatCurrency(totalRefund)}</span>
        </div>

        {taxAmount > 0 && (
          <div className="flex justify-between text-slate-500">
            <span>تسوية ضريبة القيمة المضافة:</span>
            <span className="font-bold">{formatCurrency(taxAmount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-[#1E293B]">
          <span className="font-black text-sm text-slate-900 dark:text-white">
            إجمالي المبلغ المسترد للعميل:
          </span>
          <span className="font-black text-base text-rose-600 dark:text-rose-400">
            {formatCurrency(totalRefund)}
          </span>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            variant="danger"
            size="lg"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={disabled}
            className="w-full font-bold shadow-md shadow-rose-500/20"
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            تأكيد إرجاع الأصناف واسترداد المبلغ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
