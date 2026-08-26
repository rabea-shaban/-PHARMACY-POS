import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceReceiptSettingsSchema, InvoiceReceiptSettingsFormData } from '../schemas/settingsSchemas.js';
import { SystemSettingsMap } from '../types/settings.types.js';
import { useUpdateSettings } from '../hooks/useSettings.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { Printer, FileText, CheckCircle2, AlertCircle, Save, RotateCcw } from 'lucide-react';

export interface InvoiceSettingsFormProps {
  settingsMap: SystemSettingsMap;
  isReadOnly?: boolean;
}

export const InvoiceSettingsForm: React.FC<InvoiceSettingsFormProps> = ({
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
  } = useForm<InvoiceReceiptSettingsFormData>({
    resolver: zodResolver(invoiceReceiptSettingsSchema),
    defaultValues: {
      invoice_prefix: settingsMap['invoice_prefix'] || 'INV',
      receipt_width: (settingsMap['receipt_width'] as '80mm' | '58mm') || '80mm',
      receipt_footer_text: settingsMap['receipt_footer_text'] || 'شكراً لتعاملكم معنا، مع تمنياتنا لكم بالشفاء العاجل',
      receipt_return_policy: settingsMap['receipt_return_policy'] || 'المرتجع خلال 14 يوماً مع إحضار أصل الفاتورة بحالة سليمة',
      receipt_show_tax: settingsMap['receipt_show_tax'] === 'false' ? 'false' : 'true',
      receipt_show_logo: settingsMap['receipt_show_logo'] === 'false' ? 'false' : 'true',
    },
  });

  useEffect(() => {
    reset({
      invoice_prefix: settingsMap['invoice_prefix'] || 'INV',
      receipt_width: (settingsMap['receipt_width'] as '80mm' | '58mm') || '80mm',
      receipt_footer_text: settingsMap['receipt_footer_text'] || 'شكراً لتعاملكم معنا، مع تمنياتنا لكم بالشفاء العاجل',
      receipt_return_policy: settingsMap['receipt_return_policy'] || 'المرتجع خلال 14 يوماً مع إحضار أصل الفاتورة بحالة سليمة',
      receipt_show_tax: settingsMap['receipt_show_tax'] === 'false' ? 'false' : 'true',
      receipt_show_logo: settingsMap['receipt_show_logo'] === 'false' ? 'false' : 'true',
    });
  }, [settingsMap, reset]);

  const onSubmit = (data: InvoiceReceiptSettingsFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const entries = [
      { key: 'invoice_prefix', value: data.invoice_prefix, isPublic: true, description: 'Sales Invoice Number Prefix' },
      { key: 'receipt_width', value: data.receipt_width, isPublic: true, description: 'Thermal Receipt Paper Width' },
      { key: 'receipt_footer_text', value: data.receipt_footer_text || '', isPublic: true, description: 'Receipt Footer Thank-you Note' },
      { key: 'receipt_return_policy', value: data.receipt_return_policy || '', isPublic: true, description: 'Receipt Return Policy Note' },
      { key: 'receipt_show_tax', value: data.receipt_show_tax, isPublic: true, description: 'Display VAT summary on thermal receipt' },
      { key: 'receipt_show_logo', value: data.receipt_show_logo, isPublic: true, description: 'Display Pharmacy Pulse Logo on receipt' },
    ];

    updateSettingsMutation.mutate(
      { settings: entries },
      {
        onSuccess: () => {
          setSuccessMessage('تم حفظ إعدادات ترقيم الفواتير وطباعة الإيصالات بنجاح');
          reset(data);
        },
        onError: (err: any) => {
          setErrorMessage(err?.response?.data?.message || 'فشل حفظ إعدادات الفواتير');
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
            <div className="p-2 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-black text-slate-900 dark:text-white">
                إعدادات ترقيم الفواتير والطباعة الحرارية
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                تخصيص بادئة أرقام فواتير البيع، عرض ورق الطباعة الحرارية، نصوص الترحيب وسياسة الاسترجاع
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="بادئة رقم الفاتورة (Invoice Prefix)"
              placeholder="INV أو PHARM أو POS"
              disabled={isReadOnly}
              error={errors.invoice_prefix?.message}
              leftIcon={<FileText className="w-4 h-4 text-slate-400" />}
              {...register('invoice_prefix')}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                عرض ورق الطابعة الحرارية (Thermal Receipt Width)
              </label>
              <select
                disabled={isReadOnly}
                {...register('receipt_width')}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-hidden"
              >
                <option value="80mm">80 ملم — العرض القياسي لطابعات نقاط البيع (موصى به)</option>
                <option value="58mm">58 ملم — طابعات الإيصالات المدمجة والمحمولة</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                إظهار ملخص الضريبة في الإيصال الحراري
              </label>
              <select
                disabled={isReadOnly}
                {...register('receipt_show_tax')}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-hidden"
              >
                <option value="true">نعم — إظهار خانة وقيمة الضريبة</option>
                <option value="false">لا — إخفاء تفاصيل الضريبة من الإيصال</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                إظهار شعار الصيدلية في ترويسة الإيصال
              </label>
              <select
                disabled={isReadOnly}
                {...register('receipt_show_logo')}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-hidden"
              >
                <option value="true">نعم — إظهار الشعار واسم الصيدلية</option>
                <option value="false">لا — إظهار الاسم النصي فقط</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-[#1E293B]">
            <Input
              label="عبارة الترحيب والشكر في ذيل الإيصال"
              placeholder="شكراً لتعاملكم معنا، مع تمنياتنا لكم بالشفاء العاجل"
              disabled={isReadOnly}
              error={errors.receipt_footer_text?.message}
              {...register('receipt_footer_text')}
            />

            <Input
              label="ملاحظات سياسة الاستبدال والاسترجاع"
              placeholder="المرتجع خلال 14 يوماً مع إحضار أصل الفاتورة بحالة سليمة"
              disabled={isReadOnly}
              error={errors.receipt_return_policy?.message}
              {...register('receipt_return_policy')}
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
                className="shadow-md shadow-purple-600/20"
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
