import React, { useRef } from 'react';
import {
  HeartPulse,
  PlusSquare,
  Pill,
  ShieldCheck,
  Sparkles,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button.js';
import { showWarningAlert } from '../../../lib/alerts.js';
import { PharmacyBrandLogo } from '../../../components/common/PharmacyBrandLogo.js';

export interface LogoSelectorProps {
  value?: string;
  onChange: (newLogo: string) => void;
  disabled?: boolean;
}

const PRESET_LOGOS = [
  {
    id: 'pulse',
    title: 'النبض الطبي',
    subtitle: 'Heart Pulse',
    icon: <HeartPulse className="w-5 h-5 text-sky-500" />,
    colorBg: 'bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400',
  },
  {
    id: 'cross',
    title: 'الصليب الطبي',
    subtitle: 'Medical Cross',
    icon: <PlusSquare className="w-5 h-5 text-emerald-500" />,
    colorBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  },
  {
    id: 'pill',
    title: 'الكبسولة الدوائية',
    subtitle: 'Pill Capsule',
    icon: <Pill className="w-5 h-5 text-indigo-500" />,
    colorBg: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
  },
  {
    id: 'shield',
    title: 'درع الرعاية',
    subtitle: 'Health Shield',
    icon: <ShieldCheck className="w-5 h-5 text-teal-500" />,
    colorBg: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
  },
  {
    id: 'sparkles',
    title: 'الصيدلية المتميزة',
    subtitle: 'Elite Pharmacy',
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    colorBg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  },
];

export const LogoSelector: React.FC<LogoSelectorProps> = ({
  value = '',
  onChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 1.5MB)
    if (file.size > 1.5 * 1024 * 1024) {
      showWarningAlert('حجم الصورة كبير جداً', 'يرجى اختيار صورة أقل من 1.5 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onChange(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 p-5 rounded-3xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-sky-600" />
            <span>شعار وهوية الصيدلية (Pharmacy Logo & Visual Icon)</span>
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            يظهر هذا الشعار في الشريط العلوي (Header)، القائمة الجانبية (Sidebar)، شاشة تسجيل الدخول، والإيصالات
          </p>
        </div>

        {value && !disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange('')}
            className="text-slate-500 hover:text-rose-600 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة التعيين للنبض الافتراضي</span>
          </Button>
        )}
      </div>

      {/* Main Upload / Live Preview Row */}
      <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
        {/* Visual Live Preview Box */}
        <div className="relative flex flex-col items-center gap-1.5 shrink-0">
          <div className="p-2.5 rounded-3xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-[#223049] shadow-md flex items-center justify-center">
            <PharmacyBrandLogo logo={value || 'pulse'} size="xl" />
          </div>
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400">
            المعاينة الحية
          </span>
        </div>

        {/* Upload Custom Image Button */}
        <div className="flex-1 space-y-2 text-center sm:text-start w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="hidden"
            disabled={disabled}
          />

          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-4 h-4 text-sky-600" />}
            className="bg-white dark:bg-[#131B2A] border-slate-300 dark:border-[#223049] w-full sm:w-auto"
          >
            رفع صورة الشعار الخاصة بصيدليتك (PNG, JPG, SVG)
          </Button>
          <p className="text-[10px] text-slate-400">
            الحجم الأقصى الموصى به: 1.5 ميجابايت • يفضل صورة مربعة ذات خلفية شفافة
          </p>
        </div>
      </div>

      {/* Preset Icons Selection */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-[#1E293B]">
        <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 block mb-2.5">
          أو اختر من الأيقونات والشعارات الطبية المعتمدة بنقرة واحدة:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PRESET_LOGOS.map((preset) => {
            const isSelected = value === preset.id || (!value && preset.id === 'pulse');
            return (
              <button
                key={preset.id}
                type="button"
                disabled={disabled}
                onClick={() => onChange(preset.id)}
                className={`relative p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2 text-center cursor-pointer group ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50/80 dark:bg-sky-950/50 dark:border-sky-500 shadow-md ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#131B2A] hover:bg-slate-50 dark:hover:bg-[#182334] hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                <div
                  className={`p-2.5 rounded-2xl transition-transform group-hover:scale-110 ${preset.colorBg}`}
                >
                  {preset.icon}
                </div>

                <div className="space-y-0.5">
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                    {preset.title}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {preset.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
