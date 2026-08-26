import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generalOperationsSchema, GeneralOperationsFormData } from '../schemas/settingsSchemas.js';
import { SystemSettingsMap } from '../types/settings.types.js';
import { useUpdateSettings } from '../hooks/useSettings.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Sliders, BellRing, Star, Award, Coins, Calendar, CheckCircle2, AlertCircle, Save, RotateCcw } from 'lucide-react';

export interface GeneralSettingsFormProps {
  settingsMap: SystemSettingsMap;
  isReadOnly?: boolean;
}

export const GeneralSettingsForm: React.FC<GeneralSettingsFormProps> = ({
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
    formState: { errors, isDirty },
  } = useForm<GeneralOperationsFormData>({
    resolver: zodResolver(generalOperationsSchema),
    defaultValues: {
      currency: settingsMap['currency'] || 'EGP',
      low_stock_threshold: settingsMap['low_stock_threshold'] || '10',
      expiry_alert_days: settingsMap['expiry_alert_days'] || '90',
      commission_default_rate: settingsMap['commission_default_rate'] || '5.0',
      loyalty_points_per_egp: settingsMap['loyalty_points_per_egp'] || '0.1',
      loyalty_point_value: settingsMap['loyalty_point_value'] || '0.1',
    },
  });

  useEffect(() => {
    reset({
      currency: settingsMap['currency'] || 'EGP',
      low_stock_threshold: settingsMap['low_stock_threshold'] || '10',
      expiry_alert_days: settingsMap['expiry_alert_days'] || '90',
      commission_default_rate: settingsMap['commission_default_rate'] || '5.0',
      loyalty_points_per_egp: settingsMap['loyalty_points_per_egp'] || '0.1',
      loyalty_point_value: settingsMap['loyalty_point_value'] || '0.1',
    });
  }, [settingsMap, reset]);

  const onSubmit = (data: GeneralOperationsFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const entries = [
      { key: 'currency', value: data.currency, isPublic: true, description: 'Standard Currency Symbol' },
      { key: 'low_stock_threshold', value: data.low_stock_threshold, isPublic: false, description: 'Threshold for Low Stock Warning Alerts' },
      { key: 'expiry_alert_days', value: data.expiry_alert_days, isPublic: false, description: 'Horizon for Expiring Batch Warning Alerts (Days)' },
      { key: 'commission_default_rate', value: data.commission_default_rate, isPublic: false, description: 'Default Staff Commission Percentage (%)' },
      { key: 'loyalty_points_per_egp', value: data.loyalty_points_per_egp, isPublic: false, description: 'Loyalty Points Earned per 1 EGP Spent' },
      { key: 'loyalty_point_value', value: data.loyalty_point_value, isPublic: false, description: 'Redemption Value of 1 Loyalty Point (EGP)' },
    ];

    updateSettingsMutation.mutate(
      { settings: entries },
      {
        onSuccess: () => {
          setSuccessMessage('تم حفظ معايير التشغيل والتنبيهات بنجاح');
          reset(data);
        },
        onError: (err: any) => {
          setErrorMessage(err?.response?.data?.message || 'فشل حفظ الإعدادات التشغيلية');
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
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-black text-slate-900 dark:text-white">
                المعايير التشغيلية ومستويات التنبيه
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                حدود تنبيهات نواقص الأدوية، تواريخ انتهاء الصلاحيات، معدلات احتساب نقاط الولاء، والنسبة الافتراضية للعمولات
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Currency & Inventory Alerts */}
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-rose-500" />
              <span>تنبيهات المخزون والعملة القياسية</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="العملة الرسمية للنظام"
                placeholder="EGP أو ج.م"
                disabled={isReadOnly}
                error={errors.currency?.message}
                leftIcon={<Coins className="w-4 h-4 text-slate-400" />}
                {...register('currency')}
              />

              <Input
                label="حد تنبيه النواقص الأدنى (عبوة)"
                placeholder="10"
                type="number"
                disabled={isReadOnly}
                error={errors.low_stock_threshold?.message}
                leftIcon={<BellRing className="w-4 h-4 text-rose-500" />}
                {...register('low_stock_threshold')}
              />

              <Input
                label="أفق التنبيه بانتهاء الصلاحية (يوم)"
                placeholder="90"
                type="number"
                disabled={isReadOnly}
                error={errors.expiry_alert_days?.message}
                leftIcon={<Calendar className="w-4 h-4 text-amber-500" />}
                {...register('expiry_alert_days')}
              />
            </div>
          </div>

          {/* Loyalty & Commissions */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#1E293B]">
            <h4 className="text-xs font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-500" />
              <span>حوافز الصيادلة ونقاط الولاء</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="النسبة الافتراضية لعمولة الصيدلي (%)"
                placeholder="5.0"
                type="number"
                step="0.1"
                disabled={isReadOnly}
                error={errors.commission_default_rate?.message}
                leftIcon={<Award className="w-4 h-4 text-sky-600" />}
                {...register('commission_default_rate')}
              />

              <Input
                label="نقاط الولاء المكتسبة لكل 1 ج.م"
                placeholder="0.1"
                type="number"
                step="0.01"
                disabled={isReadOnly}
                error={errors.loyalty_points_per_egp?.message}
                leftIcon={<Star className="w-4 h-4 text-amber-500" />}
                {...register('loyalty_points_per_egp')}
              />

              <Input
                label="قيمة استبدال النقطة الواحدة (ج.م)"
                placeholder="0.1"
                type="number"
                step="0.01"
                disabled={isReadOnly}
                error={errors.loyalty_point_value?.message}
                leftIcon={<Coins className="w-4 h-4 text-emerald-500" />}
                {...register('loyalty_point_value')}
              />
            </div>
          </div>

          {/* Action Footer Button */}
          {!isReadOnly && (
            <div className="pt-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                disabled={!isDirty || updateSettingsMutation.isPending}
                onClick={() => reset()}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                تراجع عن التعديلات
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={updateSettingsMutation.isPending}
                leftIcon={<Save className="w-4 h-4" />}
                className="shadow-md shadow-amber-600/20"
              >
                حفظ التعديلات (Save Changes)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
