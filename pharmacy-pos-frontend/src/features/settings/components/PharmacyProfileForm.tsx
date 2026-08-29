import React, { useEffect, useState } from 'react';
import { SystemSettingsMap } from '../types/settings.types.js';
import { useUpdateSettings } from '../hooks/useSettings.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { LogoSelector } from './LogoSelector.js';
import {
  Building2,
  Phone,
  MapPin,
  ShieldCheck,
  Mail,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
} from 'lucide-react';

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

  const [formData, setFormData] = useState({
    pharmacy_name: settingsMap['pharmacy_name'] || '',
    pharmacy_slogan: settingsMap['pharmacy_slogan'] || '',
    pharmacy_phone: settingsMap['pharmacy_phone'] || '',
    pharmacy_email: settingsMap['pharmacy_email'] || '',
    pharmacy_address: settingsMap['pharmacy_address'] || '',
    pharmacy_license: settingsMap['pharmacy_license'] || '',
    pharmacy_tax_number: settingsMap['pharmacy_tax_number'] || '',
    pharmacy_logo: settingsMap['pharmacy_logo'] || 'pulse',
  });

  const [initialData, setInitialData] = useState(formData);

  useEffect(() => {
    const fresh = {
      pharmacy_name: settingsMap['pharmacy_name'] || '',
      pharmacy_slogan: settingsMap['pharmacy_slogan'] || '',
      pharmacy_phone: settingsMap['pharmacy_phone'] || '',
      pharmacy_email: settingsMap['pharmacy_email'] || '',
      pharmacy_address: settingsMap['pharmacy_address'] || '',
      pharmacy_license: settingsMap['pharmacy_license'] || '',
      pharmacy_tax_number: settingsMap['pharmacy_tax_number'] || '',
      pharmacy_logo: settingsMap['pharmacy_logo'] || 'pulse',
    };
    setFormData(fresh);
    setInitialData(fresh);
  }, [JSON.stringify(settingsMap)]);

  const handleChange = (field: string, value: string) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!formData.pharmacy_name.trim()) {
      setErrorMessage('اسم الصيدلية الرسمي مطلوب');
      return;
    }

    const entries = [
      { key: 'pharmacy_name', value: formData.pharmacy_name.trim(), isPublic: true, description: 'Official Pharmacy Name' },
      { key: 'pharmacy_phone', value: formData.pharmacy_phone.trim(), isPublic: true, description: 'Official Hotline / WhatsApp Contact' },
      { key: 'pharmacy_address', value: formData.pharmacy_address.trim(), isPublic: true, description: 'Physical Pharmacy Address' },
      { key: 'pharmacy_license', value: formData.pharmacy_license.trim(), isPublic: true, description: 'Official Pharmacy License' },
      { key: 'pharmacy_tax_number', value: formData.pharmacy_tax_number.trim(), isPublic: true, description: 'Tax Registration ID' },
      { key: 'pharmacy_email', value: formData.pharmacy_email.trim(), isPublic: true, description: 'Official Email' },
      { key: 'pharmacy_slogan', value: formData.pharmacy_slogan.trim(), isPublic: true, description: 'Branding Slogan' },
      { key: 'pharmacy_logo', value: formData.pharmacy_logo || 'pulse', isPublic: true, description: 'Pharmacy Logo & Visual Identity' },
    ];

    updateSettingsMutation.mutate(
      { settings: entries },
      {
        onSuccess: () => {
          setSuccessMessage('تم حفظ وتحديث بيانات وهوية وشعار الصيدلية بنجاح');
          setInitialData({ ...formData });
        },
        onError: (err: any) => {
          setErrorMessage(err?.response?.data?.message || 'فشل حفظ الإعدادات');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
                بيانات وهوية المنشأة الصيدلانية
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                تظهر هذه البيانات في ترويسات الفواتير الحرارية، كشوف المرتبات، والتقارير المالية الرسمية
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Logo & Visual Identity Section */}
          <LogoSelector
            value={formData.pharmacy_logo}
            disabled={isReadOnly}
            onChange={(newLogo) => handleChange('pharmacy_logo', newLogo)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-[#1E293B]">
            <Input
              label="اسم الصيدلية الرسمي"
              placeholder="مثال: صيدلية الأمل الحديثة"
              disabled={isReadOnly}
              leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
              value={formData.pharmacy_name}
              onChange={(e) => handleChange('pharmacy_name', e.target.value)}
            />

            <Input
              label="شعار أو وصف الصيدلية (Slogan)"
              placeholder="مثال: رعاية صحية متكاملة لأسرتك"
              disabled={isReadOnly}
              leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
              value={formData.pharmacy_slogan}
              onChange={(e) => handleChange('pharmacy_slogan', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="رقم الهاتف / الخط الساخن / الواتساب"
              placeholder="+201000000000"
              disabled={isReadOnly}
              leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              value={formData.pharmacy_phone}
              onChange={(e) => handleChange('pharmacy_phone', e.target.value)}
            />

            <Input
              label="البريد الإلكتروني الرسمي"
              placeholder="contact@pharmacy.com"
              type="email"
              disabled={isReadOnly}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              value={formData.pharmacy_email}
              onChange={(e) => handleChange('pharmacy_email', e.target.value)}
            />
          </div>

          <Input
            label="العنوان الجغرافي التفصيلي"
            placeholder="مثال: القاهرة، مصر - شارع التحرير، مبنى 14"
            disabled={isReadOnly}
            leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
            value={formData.pharmacy_address}
            onChange={(e) => handleChange('pharmacy_address', e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-[#1E293B]">
            <Input
              label="رقم الترخيص الصيدلي"
              placeholder="مثال: 10482 / 2026"
              disabled={isReadOnly}
              leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
              value={formData.pharmacy_license}
              onChange={(e) => handleChange('pharmacy_license', e.target.value)}
            />

            <Input
              label="رقم السجل التجاري / البطاقة الضريبية"
              placeholder="مثال: 987-654-321"
              disabled={isReadOnly}
              leftIcon={<ShieldCheck className="w-4 h-4 text-sky-600" />}
              value={formData.pharmacy_tax_number}
              onChange={(e) => handleChange('pharmacy_tax_number', e.target.value)}
            />
          </div>

          {/* Action Footer Button */}
          {!isReadOnly && (
            <div className="pt-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                disabled={!isDirty || updateSettingsMutation.isPending}
                onClick={() => setFormData(initialData)}
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
                className="shadow-md shadow-sky-600/20"
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
