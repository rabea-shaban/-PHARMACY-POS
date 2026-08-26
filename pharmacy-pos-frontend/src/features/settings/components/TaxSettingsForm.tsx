import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taxSettingsSchema, TaxSettingsFormData } from '../schemas/settingsSchemas.js';
import { SystemSettingsMap } from '../types/settings.types.js';
import { useUpdateSettings } from '../hooks/useSettings.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Input } from '../../../components/ui/Input.js';
import { SettingsSaveBar } from './SettingsSaveBar.js';
import { Receipt, Percent, Info, CheckCircle2, AlertCircle } from 'lucide-react';

export interface TaxSettingsFormProps {
  settingsMap: SystemSettingsMap;
  isReadOnly?: boolean;
}

export const TaxSettingsForm: React.FC<TaxSettingsFormProps> = ({
  settingsMap,
  isReadOnly = false,
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const updateSettingsMutation = useUpdateSettings();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<TaxSettingsFormData>({
    resolver: zodResolver(taxSettingsSchema),
    defaultValues: {
      tax_rate: settingsMap['tax_rate'] || '0.00',
      tax_enabled: settingsMap['tax_enabled'] === 'false' ? 'false' : 'true',
      tax_number: settingsMap['tax_number'] || '',
      tax_inclusive: settingsMap['tax_inclusive'] === 'false' ? 'false' : 'true',
    },
  });

  const currentTaxRate = watch('tax_rate');

  useEffect(() => {
    reset({
      tax_rate: settingsMap['tax_rate'] || '0.00',
      tax_enabled: settingsMap['tax_enabled'] === 'false' ? 'false' : 'true',
      tax_number: settingsMap['tax_number'] || '',
      tax_inclusive: settingsMap['tax_inclusive'] === 'false' ? 'false' : 'true',
    });
  }, [settingsMap, reset]);

  const onSubmit = (data: TaxSettingsFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const entries = [
      { key: 'tax_rate', value: data.tax_rate, isPublic: true, description: 'Default Sales Tax Rate (%)' },
      { key: 'tax_enabled', value: data.tax_enabled, isPublic: true, description: 'Is VAT Tax Calculation Enabled' },
      { key: 'tax_number', value: data.tax_number || '', isPublic: true, description: 'Official Tax ID' },
      { key: 'tax_inclusive', value: data.tax_inclusive, isPublic: true, description: 'Prices are Inclusive of VAT' },
    ];

    updateSettingsMutation.mutate(
      { settings: entries },
      {
        onSuccess: () => {
          setSuccessMessage('تم تحديث إعدادات ضريبة القيمة المضافة (VAT) بنجاح');
          reset(data);
        },
        onError: (err: any) => {
          setErrorMessage(err?.response?.data?.message || 'فشل حفظ إعدادات الضرائب');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Card className="rounded-3xl shadow-xs overflow-hidden border-slate-200/80 dark:border-[#1E293B]">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-black text-slate-900 dark:text-white">
                إعدادات الضرائب وضريبة القيمة المضافة (VAT & Tax Configuration)
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                تحديد النسبة الضريبية الافتراضية، الرقم الضريبي، وتطبيقها آلياً في فواتير الـ POS ونقاط البيع
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="نسبة ضريبة القيمة المضافة (%)"
              placeholder="0.00 أو 14.00"
              type="number"
              step="0.01"
              disabled={isReadOnly}
              error={errors.tax_rate?.message}
              leftIcon={<Percent className="w-4 h-4 text-slate-400" />}
              {...register('tax_rate')}
            />

            <Input
              label="رقم التسجيل الضريبي للمنشأة"
              placeholder="مثال: 300-123-456"
              disabled={isReadOnly}
              error={errors.tax_number?.message}
              leftIcon={<Receipt className="w-4 h-4 text-slate-400" />}
              {...register('tax_number')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                حالة احتساب الضريبة في نقطة البيع (POS)
              </label>
              <select
                disabled={isReadOnly}
                {...register('tax_enabled')}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-hidden"
              >
                <option value="true">مفعلة — يتم حساب الضريبة وإظهارها في الفواتير</option>
                <option value="false">معطلة — نسبة الضريبة صفر % (معفاة تماماً)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                طريقة تسعير الأصناف
              </label>
              <select
                disabled={isReadOnly}
                {...register('tax_inclusive')}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-hidden"
              >
                <option value="true">الأسعار شاملة ضريبة القيمة المضافة (Tax-Inclusive)</option>
                <option value="false">الأسعار غير شاملة الضريبة (تضاف عند الفاتورة)</option>
              </select>
            </div>
          </div>

          {/* Tax Calculation Live Impact Box */}
          <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-sky-900 dark:text-sky-200">
              <Info className="w-4 h-4 text-sky-600 shrink-0" />
              <span>الأثر المالي المباشر في منظومة الـ POS:</span>
            </div>
            <p className="text-xs text-sky-800 dark:text-sky-300 leading-relaxed">
              عند إتمام أي عملية بيع بسعر <span className="font-mono font-bold">100.00 ج.م</span>، ستكون قيمة الضريبة المحتسبة هي{' '}
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {(100 * (Number(currentTaxRate) || 0) / 100).toFixed(2)} ج.م
              </span>{' '}
              بنسبة (<span className="font-mono font-bold">{Number(currentTaxRate) || 0}%</span>)، وتنعكس تلقائياً في خانة الضريبة بفاتورة الكاشير والتقارير المالية.
            </p>
          </div>
        </CardContent>
      </Card>

      <SettingsSaveBar
        isDirty={isDirty}
        isLoading={updateSettingsMutation.isPending}
        onSave={handleSubmit(onSubmit)}
        onReset={() => reset()}
      />
    </form>
  );
};
