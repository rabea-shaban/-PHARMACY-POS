import React from 'react';
import { RotateCcw } from 'lucide-react';

export interface ReturnReasonSelectProps {
  value: string;
  onChange: (reason: string) => void;
}

export const ReturnReasonSelect: React.FC<ReturnReasonSelectProps> = ({
  value,
  onChange,
}) => {

  const standardReasons = [
    'دواء خاطئ / صرف بالخطأ',
    'العميل غيّر رأيه (العبوة مغلقة وسليمة)',
    'تغيير الطبيب للوصفة / الجرعة',
    'عيب صناعة / تلف في العبوة',
    'انتهاء أو قرب انتهاء الصلاحية',
    'أخرى (تحديد في الملاحظات)',
  ];

  return (
    <div className="space-y-1.5 text-start">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
        سبب الاسترجاع (إجباري للتدقيق)
      </label>
      <div className="relative rounded-2xl">
        <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
          <RotateCcw className="w-4 h-4" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-2xl border py-2.5 ps-10 pe-4 text-xs bg-white border-slate-200 text-slate-900 dark:bg-[#0B0F17] dark:border-[#223049] dark:text-slate-100 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
        >
          <option value="">اختر سبب الاسترجاع...</option>
          {standardReasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
