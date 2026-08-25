import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCustomerSchema, CustomerFormValues } from '../schemas/customerSchemas.js';
import { Customer, CustomerTier } from '../types/customer.types.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { User, Phone, Mail, MapPin, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CustomerFormProps {
  initialData?: Customer;
  tiers: CustomerTier[];
  onSubmit: (values: CustomerFormValues) => Promise<void>;
  isLoading: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  tiers,
  onSubmit,
  isLoading,
}) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(getCustomerSchema()),
    defaultValues: {
      name: initialData?.name || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      address: initialData?.address || '',
      notes: initialData?.notes || '',
      dateOfBirth: initialData?.dateOfBirth ? initialData.dateOfBirth.slice(0, 10) : '',
      gender: initialData?.gender || undefined,
      tierId: initialData?.tierId || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">البيانات الأساسية ومعلومات الاتصال</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div>
              <Input
                label="اسم العميل الكامل *"
                placeholder="مثال: أحمد محمد علي"
                error={errors.name?.message}
                {...register('name')}
                leftIcon={<User className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                label="رقم الهاتف الأساسي *"
                placeholder="مثال: 01012345678"
                error={errors.phone?.message}
                {...register('phone')}
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                label="البريد الإلكتروني (اختياري)"
                placeholder="example@domain.com"
                error={errors.email?.message}
                {...register('email')}
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                label="العنوان ومحل الإقامة"
                placeholder="الشارع، الحي، المدينة..."
                error={errors.address?.message}
                {...register('address')}
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Demographic & Loyalty Profile */}
        <Card className="rounded-3xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
            <CardTitle className="text-sm">الملف الديموغرافي وفئة الولاء</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div>
              <Input
                type="date"
                label="تاريخ الميلاد"
                error={errors.dateOfBirth?.message}
                {...register('dateOfBirth')}
                leftIcon={<Calendar className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                النوع / الجنس
              </label>
              <select
                {...register('gender')}
                className="w-full rounded-2xl border py-2.5 px-3 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">غير محدد</option>
                <option value="MALE">ذكر</option>
                <option value="FEMALE">أنثى</option>
                <option value="OTHER">أخرى</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                فئة العميل التراكمية (Loyalty Tier)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                  <Award className="w-4 h-4" />
                </div>
                <select
                  {...register('tierId')}
                  className="w-full rounded-2xl border py-2.5 ps-10 pe-3 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="">فئة افتراضية (بدون فئة خاصة)</option>
                  {tiers.map((tr) => (
                    <option key={tr.id} value={tr.id}>
                      {tr.name} (خصم {tr.discountPercentage}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                ملاحظات إضافية أو توصيات خاصة
              </label>
              <textarea
                rows={2}
                placeholder="أي ملاحظات طبية أو أمراض مزمنة أو تفضيلات للعميل..."
                {...register('notes')}
                className="w-full rounded-2xl border p-3 text-xs bg-white dark:bg-[#0B0F17] border-slate-200 text-slate-900 dark:border-[#223049] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-[#1E293B]">
        <Link to="/customers">
          <Button type="button" variant="outline" size="md">
            {t('common.cancel')}
          </Button>
        </Link>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
        >
          {initialData ? 'حفظ تعديلات العميل' : 'تسجيل العميل الجديد'}
        </Button>
      </div>
    </form>
  );
};
