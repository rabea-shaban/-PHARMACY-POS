import React from 'react';
import { SystemSettingsMap } from '../types/settings.types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { HeartPulse, Printer, QrCode } from 'lucide-react';

export interface BrandingPreviewProps {
  settingsMap: SystemSettingsMap;
}

export const BrandingPreview: React.FC<BrandingPreviewProps> = ({ settingsMap }) => {
  const pharmacyName = settingsMap['pharmacy_name'] || 'صيدلية الأمل الحديثة';
  const pharmacyPhone = settingsMap['pharmacy_phone'] || '+201000000000';
  const pharmacyAddress = settingsMap['pharmacy_address'] || 'القاهرة، مصر';
  const pharmacyLicense = settingsMap['pharmacy_license'] || '10482 / 2026';
  const pharmacyTaxNumber = settingsMap['pharmacy_tax_number'] || '300-123-456';
  const invoicePrefix = settingsMap['invoice_prefix'] || 'INV';
  const receiptWidth = settingsMap['receipt_width'] || '80mm';
  const receiptFooter = settingsMap['receipt_footer_text'] || 'شكراً لتعاملكم معنا، مع تمنياتنا لكم بالشفاء العاجل';
  const receiptPolicy = settingsMap['receipt_return_policy'] || 'المرتجع خلال 14 يوماً مع إحضار أصل الفاتورة';
  const showLogo = settingsMap['receipt_show_logo'] !== 'false';
  const showTax = settingsMap['receipt_show_tax'] !== 'false';
  const taxRate = Number(settingsMap['tax_rate'] || 0);

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl shadow-xs overflow-hidden border-slate-200/80 dark:border-[#1E293B]">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-black text-slate-900 dark:text-white">
                المعاينة الحية لهوية ومطبوعات الصيدلية (Live Branding & Receipt Preview)
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                معاينة مباشرة لشكل الإيصال الحراري وترويسة الفواتير بناءً على الإعدادات المسجلة حالياً
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex justify-center">
            {/* 80mm / 58mm Thermal Receipt Mockup */}
            <div
              className={`bg-white text-slate-900 border-2 border-dashed border-slate-300 rounded-2xl p-6 shadow-xl space-y-4 font-sans text-xs transition-all ${
                receiptWidth === '58mm' ? 'w-64 max-w-64' : 'w-80 max-w-80'
              }`}
            >
              {/* Receipt Header */}
              <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
                {showLogo && (
                  <div className="inline-flex items-center justify-center p-2 rounded-full bg-sky-50 text-sky-600 mb-1">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                )}
                <h3 className="font-black text-sm text-slate-900 tracking-tight">{pharmacyName}</h3>
                <p className="text-[10px] text-slate-600 font-bold">{pharmacyAddress}</p>
                <p className="text-[10px] text-slate-600 font-mono">هاتف: {pharmacyPhone}</p>
                {pharmacyTaxNumber && (
                  <p className="text-[9px] text-slate-500 font-mono">ر.ض: {pharmacyTaxNumber}</p>
                )}
                {pharmacyLicense && (
                  <p className="text-[9px] text-slate-500 font-mono">ترخيص: {pharmacyLicense}</p>
                )}
              </div>

              {/* Invoice Meta */}
              <div className="text-[10px] space-y-0.5 font-mono border-b border-dashed border-slate-300 pb-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">رقم الفاتورة:</span>
                  <span className="font-bold text-slate-900">#{invoicePrefix}-202608-0142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">التاريخ:</span>
                  <span>26/08/2026 14:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">الكاشير:</span>
                  <span>د. ربيع شعبان</span>
                </div>
              </div>

              {/* Sample Items Table */}
              <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3 text-[11px]">
                <div className="flex justify-between font-bold text-slate-500 text-[10px]">
                  <span>الصنف</span>
                  <span>الإجمالي</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="font-bold block">Panadol Extra 500mg</span>
                    <span className="text-[9px] text-slate-500 font-mono">2 × 35.00</span>
                  </div>
                  <span className="font-bold font-mono">70.00</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="font-bold block">Augmentin 1g Tab</span>
                    <span className="text-[9px] text-slate-500 font-mono">1 × 130.00</span>
                  </div>
                  <span className="font-bold font-mono">130.00</span>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>المجموع الفرعي:</span>
                  <span>200.00 ج.م</span>
                </div>
                {showTax && (
                  <div className="flex justify-between text-slate-600">
                    <span>ضريبة القيمة المضافة ({taxRate}%):</span>
                    <span>{(200 * taxRate / 100).toFixed(2)} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black border-t border-slate-900 pt-1.5 text-slate-900">
                  <span>الإجمالي النهائي:</span>
                  <span>{(200 + (200 * taxRate / 100)).toFixed(2)} ج.م</span>
                </div>
              </div>

              {/* Footer Notes & QR Code */}
              <div className="text-center space-y-2 border-t border-dashed border-slate-300 pt-3">
                <div className="flex justify-center text-slate-700">
                  <QrCode className="w-12 h-12" />
                </div>
                <p className="text-[10px] font-bold text-slate-800 leading-tight">
                  {receiptFooter}
                </p>
                <p className="text-[8px] text-slate-500">
                  {receiptPolicy}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
