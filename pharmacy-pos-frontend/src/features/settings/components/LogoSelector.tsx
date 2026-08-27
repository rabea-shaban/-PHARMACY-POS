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
} from 'lucide-react';
import { Button } from '../../../components/ui/Button.js';
import { showWarningAlert } from '../../../lib/alerts.js';

export interface LogoSelectorProps {
  value?: string;
  onChange: (newLogo: string) => void;
  disabled?: boolean;
}

const PRESET_LOGOS = [
  { id: 'pulse', label: 'النبض الطبي (Heart Pulse)', icon: <HeartPulse className="w-6 h-6 text-sky-500" /> },
  { id: 'cross', label: 'الصليب الطبي (Medical Cross)', icon: <PlusSquare className="w-6 h-6 text-emerald-500" /> },
  { id: 'pill', label: 'الكبسولة الدوائية (Pill Capsule)', icon: <Pill className="w-6 h-6 text-indigo-500" /> },
  { id: 'shield', label: 'درع الأمان والرعاية (Health Shield)', icon: <ShieldCheck className="w-6 h-6 text-teal-500" /> },
  { id: 'sparkles', label: 'الصيدلية المتميزة (Elite Pharmacy)', icon: <Sparkles className="w-6 h-6 text-amber-500" /> },
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

  const isCustomImage = value && value.startsWith('data:image');

  return (
    <div className="space-y-4 p-5 rounded-3xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049]">
      <div className="flex items-center justify-between">
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
            className="text-slate-500 hover:text-rose-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة التعيين للشعار الافتراضي</span>
          </Button>
        )}
      </div>

      {/* Main Upload / Preview Row */}
      <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
        {/* Visual Preview Box */}
        <div className="relative group">
          <div className="w-20 h-20 rounded-3xl bg-white dark:bg-[#131B2A] border-2 border-dashed border-sky-300 dark:border-sky-800 shadow-md flex items-center justify-center overflow-hidden p-2">
            {isCustomImage ? (
              <img src={value} alt="Pharmacy Logo" className="w-full h-full object-contain" />
            ) : value === 'cross' ? (
              <PlusSquare className="w-10 h-10 text-emerald-500" />
            ) : value === 'pill' ? (
              <Pill className="w-10 h-10 text-indigo-500" />
            ) : value === 'shield' ? (
              <ShieldCheck className="w-10 h-10 text-teal-500" />
            ) : value === 'sparkles' ? (
              <Sparkles className="w-10 h-10 text-amber-500" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-teal-400 text-white flex items-center justify-center shadow-md">
                <HeartPulse className="w-7 h-7 text-white animate-pulse" />
              </div>
            )}
          </div>
          <span className="block text-center text-[10px] font-bold text-slate-400 mt-1">
            المعاينة الحية
          </span>
        </div>

        {/* Upload Button */}
        <div className="flex-1 space-y-2 text-center sm:text-start">
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
            className="bg-white dark:bg-[#131B2A] border-slate-300 dark:border-[#223049]"
          >
            رفع صورة الشعار من جهازك (PNG, JPG, SVG)
          </Button>
          <p className="text-[10px] text-slate-400">
            الحجم الأقصى الموصى به: 1.5 ميجابايت • خلفية شفافة مفضلة
          </p>
        </div>
      </div>

      {/* Preset Icons Selection */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-[#1E293B]">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-2">
          أو اختر من الأيقونات والشعارات الطبية المعتمدة:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {PRESET_LOGOS.map((preset) => {
            const isSelected = value === preset.id || (!value && preset.id === 'pulse');
            return (
              <button
                key={preset.id}
                type="button"
                disabled={disabled}
                onClick={() => onChange(preset.id)}
                className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:border-sky-500 ring-2 ring-sky-500/20'
                    : 'border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#131B2A] hover:bg-slate-50'
                }`}
              >
                {preset.icon}
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center">
                  {preset.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
