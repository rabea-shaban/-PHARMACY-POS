import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Clock, Calendar, FileText, CheckCircle2, Pill } from 'lucide-react';
import { CartItemMedicationInstruction } from '../types/checkout.types.js';

export type CheckoutMedicationInstructionDTO = CartItemMedicationInstruction;

export interface MedicationInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId: string;
  initialValue?: Partial<CheckoutMedicationInstructionDTO>;
  onSave: (instruction: CheckoutMedicationInstructionDTO) => void;
}

const FREQUENCY_PRESETS = [
  { id: 'once_morning', labelAr: 'مرة واحدة يومياً (صباحاً)', labelEn: 'Once daily (Morning)', times: ['08:00 AM'] },
  { id: 'once_evening', labelAr: 'مرة واحدة يومياً (مساءً)', labelEn: 'Once daily (Evening)', times: ['08:00 PM'] },
  { id: 'twice_daily', labelAr: 'مرتين يومياً (كل 12 ساعة)', labelEn: 'Twice daily (Every 12 hrs)', times: ['08:00 AM', '08:00 PM'] },
  { id: 'thrice_daily', labelAr: '3 مرات يومياً (كل 8 ساعات)', labelEn: '3 times daily (Every 8 hrs)', times: ['08:00 AM', '04:00 PM', '12:00 AM'] },
  { id: 'four_times', labelAr: '4 مرات يومياً (كل 6 ساعات)', labelEn: '4 times daily (Every 6 hrs)', times: ['06:00 AM', '12:00 PM', '06:00 PM', '12:00 AM'] },
  { id: 'as_needed', labelAr: 'عند اللزوم / عند الألم', labelEn: 'As needed / PRN', times: [] },
];

const TIME_SLOTS = [
  { id: 'morning', labelAr: 'صباحاً (08:00 AM)', labelEn: 'Morning (08:00 AM)', time: '08:00 AM' },
  { id: 'noon', labelAr: 'ظهراً (02:00 PM)', labelEn: 'Noon (02:00 PM)', time: '02:00 PM' },
  { id: 'evening', labelAr: 'مساءً (08:00 PM)', labelEn: 'Evening (08:00 PM)', time: '08:00 PM' },
  { id: 'bedtime', labelAr: 'قبل النوم (11:00 PM)', labelEn: 'Bedtime (11:00 PM)', time: '11:00 PM' },
];

const DURATION_PRESETS = [
  { labelAr: '3 أيام', labelEn: '3 days' },
  { labelAr: '5 أيام', labelEn: '5 days' },
  { labelAr: '7 أيام', labelEn: '7 days' },
  { labelAr: '10 أيام', labelEn: '10 days' },
  { labelAr: '14 يوم', labelEn: '14 days' },
  { labelAr: 'شهر', labelEn: '1 month' },
];

export const MedicationInstructionModal: React.FC<MedicationInstructionModalProps> = ({
  isOpen,
  onClose,
  productName,
  productId,
  initialValue,
  onSave,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language !== 'en';

  const [type, setType] = useState<'ACUTE' | 'CHRONIC'>(initialValue?.type || 'ACUTE');
  const [dosage, setDosage] = useState<string>(initialValue?.dosage || '1 قرص');
  const [dosageUnit, setDosageUnit] = useState<string>(initialValue?.dosageUnit || '');
  const [frequency, setFrequency] = useState<string>(initialValue?.frequency || 'مرتين يومياً (كل 12 ساعة)');
  const [selectedTimes, setSelectedTimes] = useState<string[]>(() => {
    if (!initialValue?.dosageTimes) return ['08:00 AM', '08:00 PM'];
    if (Array.isArray(initialValue.dosageTimes)) return initialValue.dosageTimes;
    try {
      const parsed = JSON.parse(initialValue.dosageTimes as string);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      return String(initialValue.dosageTimes).split(',').map((s) => s.trim());
    }
  });
  const [duration, setDuration] = useState<string>(initialValue?.duration || '7 أيام');
  const [isContinuous, setIsContinuous] = useState<boolean>(initialValue?.isContinuous || false);
  const [doctorNotes, setDoctorNotes] = useState<string>(initialValue?.doctorNotes || '');

  if (!isOpen) return null;

  const handleFrequencySelect = (preset: typeof FREQUENCY_PRESETS[0]) => {
    setFrequency(isAr ? preset.labelAr : preset.labelEn);
    if (preset.times.length > 0) {
      setSelectedTimes(preset.times);
    }
  };

  const toggleTimeSlot = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      productId,
      type,
      dosage: dosage.trim() || '1 قرص',
      dosageUnit: dosageUnit.trim() || undefined,
      frequency: frequency.trim() || 'يومياً',
      dosageTimes: selectedTimes.length > 0 ? selectedTimes : null,
      duration: isContinuous ? null : duration.trim() || null,
      isContinuous,
      doctorNotes: doctorNotes.trim() || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {isAr ? 'تعليمات وجرعة الدواء' : 'Medication Instructions & Dosage'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm font-medium">
                {productName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          {/* Medication Classification (Acute vs Chronic) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {isAr ? 'تصنيف الدواء للمريض' : 'Medication Classification'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setType('ACUTE');
                  setIsContinuous(false);
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition ${
                  type === 'ACUTE'
                    ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>🔵</span>
                {isAr ? 'علاج عرضي / مؤقت (Acute)' : 'Acute / Temporary'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('CHRONIC');
                  setIsContinuous(true);
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition ${
                  type === 'CHRONIC'
                    ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>🔴</span>
                {isAr ? 'علاج مزمن (Chronic)' : 'Chronic Condition'}
              </button>
            </div>
          </div>

          {/* Dosage & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'مقدار الجرعة' : 'Dosage Amount'}
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder={isAr ? 'مثال: 1 قرص / 5 مل' : 'e.g. 1 tablet / 5ml'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? 'الوحدة (اختياري)' : 'Unit (Optional)'}
              </label>
              <input
                type="text"
                value={dosageUnit}
                onChange={(e) => setDosageUnit(e.target.value)}
                placeholder={isAr ? 'قرص / ملعقة / كبسولة' : 'tab / spoonful / cap'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Frequency & Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {isAr ? 'تكرار الجرعة' : 'Frequency'}
            </label>
            <input
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder={isAr ? 'مثال: كل 8 ساعات' : 'e.g. Every 8 hours'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 mb-2"
              required
            />
            <div className="flex flex-wrap gap-1.5">
              {FREQUENCY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleFrequencySelect(preset)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-400 transition"
                >
                  {isAr ? preset.labelAr : preset.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                {isAr ? 'المواعيد المحددة للتناول' : 'Scheduled Dosage Times'}
              </label>
              <span className="text-[11px] text-slate-400">
                {selectedTimes.length} {isAr ? 'محدد' : 'selected'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTimes.includes(slot.time);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => toggleTimeSlot(slot.time)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold ring-1 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {isAr ? slot.labelAr : slot.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration & Continuous Flag */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                {isAr ? 'مدة العلاج' : 'Duration'}
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isContinuous}
                  onChange={(e) => setIsContinuous(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>{isAr ? 'علاج مستمر مدى الحياة' : 'Continuous Treatment'}</span>
              </label>
            </div>

            {!isContinuous ? (
              <>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder={isAr ? 'مثال: 7 أيام' : 'e.g. 7 days'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {DURATION_PRESETS.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setDuration(isAr ? d.labelAr : d.labelEn)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 transition"
                    >
                      {isAr ? d.labelAr : d.labelEn}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                {isAr
                  ? 'تم تعيين هذا الدواء كعلاج دائم ومستمر في الملف الدوائي للمريض.'
                  : 'This medication is marked as permanent and continuous in the patient profile.'}
              </div>
            )}
          </div>

          {/* Doctor / Pharmacist Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-500" />
              {isAr ? 'ملاحظات الصيدلي أو الطبيب' : 'Doctor / Pharmacist Instructions'}
            </label>
            <textarea
              rows={2}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder={
                isAr
                  ? 'مثال: يؤخذ بعد الأكل بنصف ساعة مع كوب ماء كبير، تجنب تناوله مع منتجات الألبان'
                  : 'e.g. Take 30 mins after meals with plenty of water, avoid dairy'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/20 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isAr ? 'حفظ التعليمات' : 'Save Instructions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
