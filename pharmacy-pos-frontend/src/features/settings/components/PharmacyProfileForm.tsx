import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pharmacyProfileSchema, PharmacyProfileFormData } from '../schemas/settingsSchemas.js';
import { SystemSettingsMap } from '../types/settings.types.js';
import { useUpdateSettings } from '../hooks/useSettings.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Input } from '../../../components/ui/Input.js';
import { SettingsSaveBar } from './SettingsSaveBar.js';
import { Building2, Phone, MapPin, ShieldCheck, Mail, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export interface PharmacyProfileFormProps {
  settingsMap: SystemSettingsMap;
  isReadOnly?: boolean;
}

export const PharmacyProfileForm: React.FC<PharmacyProfileFormProps> = ({
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
  } = useForm<PharmacyProfileFormData>({
    resolver: zodResolver(pharmacyProfileSchema),
    defaultValues: {
      pharmacy_name: settingsMap['pharmacy_name'] || '',
      pharmacy_phone: settingsMap['pharmacy_phone'] || '',
      pharmacy_address: settingsMap['pharmacy_address'] || '',
      pharmacy_license: settingsMap['pharmacy_license'] || '',
      pharmacy_tax_number: settingsMap['pharmacy_tax_number'] || '',
      pharmacy_email: settingsMap['pharmacy_email'] || '',
      pharmacy_slogan: settingsMap['pharmacy_slogan'] || '',
    },
  });

  useEffect(() => {
    reset({
      pharmacy_name: settingsMap['pharmacy_name'] || '',
      pharmacy_phone: settingsMap['pharmacy_phone'] || '',
      pharmacy_address: settingsMap['pharmacy_address'] || '',
      pharmacy_license: settingsMap['pharmacy_license'] || '',
      pharmacy_tax_number: settingsMap['pharmacy_tax_number'] || '',
      pharmacy_email: settingsMap['pharmacy_email'] || '',
      pharmacy_slogan: settingsMap['pharmacy_slogan'] || '',
    });
  }, [settingsMap, reset]);

  const onSubmit = (data: PharmacyProfileFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const entries = [
      { key: 'pharmacy_name', value: data.pharmacy_name, isPublic: true, description: 'Official Pharmacy Name' },
      { key: 'pharmacy_phone', value: data.pharmacy_phone, isPublic: true, description: 'Official Hotline / WhatsApp Contact' },
      { key: 'pharmacy_address', value: data.pharmacy_address, isPublic: true, description: 'Physical Pharmacy Address' },
      { key: 'pharmacy_license', value: data.pharmacy_license || '', isPublic: true, description: 'Official Pharmacy License' },
      { key: 'pharmacy_tax_number', value: data.pharmacy_tax_number || '', isPublic: true, description: 'Tax Registration ID' },
      { key: 'pharmacy_email', value: data.pharmacy_email || '', isPublic: true, description: 'Official Email' },
      { key: 'pharmacy_slogan', value: data.pharmacy_slogan || '', isPublic: true, description: 'Branding Slogan' },
    ];

    updateSettingsMutation.mutate(
      { settings: entries },
      {
        onSuccess: () => {
          setSuccessMessage('تم حفظ وتحديث بيانات وهوية الصيدلية بنجاح');
          reset(data);
        },
        onError: (err: any) => {
          setErrorMessage(err?.response?.data?.message || 'فشل حفظ الإعدادات');
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
            <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-black text-slate-900 dark:text-white">
                بيانات وهوية المنشأة الصيدلانية (Pharmacy Profile & Legal Identity)
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                تظهر هذه البيانات في ترويسات الفواتير الحرارية، كشوف المرتبات، والتقارير المالية الرسمية
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="اسم الصيدلية الرسمي"
              placeholder="مثال: صيدلية الأمل الحديثة"
              disabled={isReadOnly}
              error={errors.pharmacy_name?.message}
              leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
              {...register('pharmacy_name')}
            />

            <Input
              label="شعار أو وصف الصيدلية (Slogan)"
              placeholder="مثال: رعاية صحية متكاملة لأسرتك"
              disabled={isReadOnly}
              error={errors.pharmacy_slogan?.message}
              leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
              {...register('pharmacy_slogan')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="رقم الهاتف / الخط الساخن / الواتساب"
              placeholder="+201000000000"
              disabled={isReadOnly}
              error={errors.pharmacy_phone?.message}
              leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              {...register('pharmacy_phone')}
            />

            <Input
              label="البريد الإلكتروني الرسمي"
              placeholder="contact@pharmacy.com"
              type="email"
              disabled={isReadOnly}
              error={errors.pharmacy_email?.message}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              {...register('pharmacy_email')}
            />
          </div>

          <Input
            label="العنوان الجغرافي التفصيلي"
            placeholder="مثال: القاهرة، مصر - شارع التحرير، مبنى 14"
            disabled={isReadOnly}
            error={errors.pharmacy_address?.message}
            leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
            {...register('pharmacy_address')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-[#1E293B]">
            <Input
              label="رقم الترخيص الصيدلي"
              placeholder="مثال: 10482 / 2026"
              disabled={isReadOnly}
              error={errors.pharmacy_license?.message}
              leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
              {...register('pharmacy_license')}
            />

            <Input
              label="رقم السجل التجاري / البطاقة الضريبية"
              placeholder="مثال: 987-654-321"
              disabled={isReadOnly}
              error={errors.pharmacy_tax_number?.message}
              leftIcon={<ShieldCheck className="w-4 h-4 text-sky-600" />}
              {...register('pharmacy_tax_number')}
            />
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
