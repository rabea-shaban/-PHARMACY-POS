import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import {
  Printer,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Play,
  Sliders,
  Laptop,
  Check,
} from 'lucide-react';
import type { PrinterInfo } from '../../../types/electron.js';
import { useAppSelector } from '../../../store/hooks.js';

export const PrinterSettingsTab: React.FC = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');
  const { publicSettings } = useAppSelector((state) => state.settings);

  const [printers, setPrinters] = useState<PrinterInfo[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [paperSize, setPaperSize] = useState<'80mm' | '58mm'>('80mm');
  const [directPrintEnabled, setDirectPrintEnabled] = useState<boolean>(true);
  const [copies, setCopies] = useState<number>(1);
  const [isLoadingPrinters, setIsLoadingPrinters] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI?.printer);

  // Load saved preferences
  useEffect(() => {
    const savedPrinter = localStorage.getItem('pos_printer_name') || '';
    const savedSize = (localStorage.getItem('pos_paper_size') as '80mm' | '58mm') || '80mm';
    const savedDirect = localStorage.getItem('pos_direct_print') !== 'false';
    const savedCopies = parseInt(localStorage.getItem('pos_print_copies') || '1', 10);

    setSelectedPrinter(savedPrinter);
    setPaperSize(savedSize);
    setDirectPrintEnabled(savedDirect);
    setCopies(savedCopies || 1);

    if (isElectron) {
      loadPrinters();
    }
  }, [isElectron]);

  const loadPrinters = async () => {
    if (!window.electronAPI?.printer) return;
    setIsLoadingPrinters(true);
    setTestResult(null);

    try {
      const list = await window.electronAPI.printer.list();
      setPrinters(list);

      // Auto select default if none selected
      const savedPrinter = localStorage.getItem('pos_printer_name');
      if (!savedPrinter && list.length > 0) {
        const defaultP = list.find((p) => p.isDefault) || list[0];
        setSelectedPrinter(defaultP.name);
        localStorage.setItem('pos_printer_name', defaultP.name);
      }
    } catch (err) {
      console.error('Failed to load printers:', err);
    } finally {
      setIsLoadingPrinters(false);
    }
  };

  const handleSelectPrinter = (printerName: string) => {
    setSelectedPrinter(printerName);
    localStorage.setItem('pos_printer_name', printerName);
  };

  const handlePaperSizeChange = (size: '80mm' | '58mm') => {
    setPaperSize(size);
    localStorage.setItem('pos_paper_size', size);
  };

  const handleDirectPrintToggle = (enabled: boolean) => {
    setDirectPrintEnabled(enabled);
    localStorage.setItem('pos_direct_print', enabled ? 'true' : 'false');
  };

  const handleCopiesChange = (count: number) => {
    const val = Math.max(1, count);
    setCopies(val);
    localStorage.setItem('pos_print_copies', String(val));
  };

  const handleTestPrint = async () => {
    if (!window.electronAPI?.printer) {
      setTestResult({
        success: false,
        message: isArabic
          ? 'الطباعة المباشرة متاحة فقط داخل تطبيق سطح المكتب (Electron Desktop).'
          : 'Direct printing is only available in Electron Desktop app.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await window.electronAPI.printer.printTest({
        printerName: selectedPrinter,
        paperSize,
        branding: {
          pharmacyName: publicSettings.pharmacyName,
          pharmacySlogan: publicSettings.pharmacySlogan,
        },
      });

      if (result.success) {
        setTestResult({
          success: true,
          message: isArabic
            ? `تم إرسال أمر الطباعة بنجاح إلى '${result.printerName || selectedPrinter}' (${paperSize}).`
            : `Test receipt sent successfully to '${result.printerName || selectedPrinter}' (${paperSize}).`,
        });
      } else {
        setTestResult({
          success: false,
          message: result.error || (isArabic ? 'تعذر إرسال الإيصال إلى الطابعة.' : 'Failed to print test receipt.'),
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || (isArabic ? 'حدث خطأ أثناء الاتصال بالعتاد.' : 'Hardware communication error.'),
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Test feedback alerts */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
            testResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Main Configuration Card */}
      <Card className="rounded-3xl shadow-xs overflow-hidden border-slate-200/80 dark:border-[#1E293B]">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-[#1E293B]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-black text-slate-900 dark:text-white">
                  {isArabic ? 'طابعات نقاط البيع والطباعة الحرارية المباشرة' : 'POS Hardware Printers & Direct Printing'}
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isArabic
                    ? 'إدارة الطابعات الحرارية المتصلة، مقاس الورق، والطباعة الصامتة للفواتير دون نافذة حوار'
                    : 'Manage thermal receipt printers, paper sizes, and silent printing without browser dialogs'}
                </p>
              </div>
            </div>

            {isElectron && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadPrinters}
                isLoading={isLoadingPrinters}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                {isArabic ? 'إعادة اكتشاف الطابعات' : 'Refresh Printers'}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Environment Banner */}
          {!isElectron ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3">
              <Laptop className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {isArabic
                    ? 'أنت تعمل حالياً في متصفح الويب (Web Browser)'
                    : 'You are currently running inside a Web Browser'}
                </p>
                <p className="mt-0.5 text-amber-700 dark:text-amber-400">
                  {isArabic
                    ? 'الطباعة الحرارية الصامتة المباشرة (Direct Thermal Printing) تعمل بكامل كفاءتها داخل تطبيق سطح المكتب (Desktop App). في المتصفح يتم استخدام نافذة الطباعة الافتراضية.'
                    : 'Direct silent printing operates inside the Desktop Application shell. Browser Print Dialog is used as fallback.'}
                </p>
              </div>
            </div>
          ) : null}

          {/* Direct Print Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-100 dark:border-[#223049] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {isArabic ? 'الطباعة الحرارية المباشرة (Direct Thermal Printing)' : 'Direct Thermal Printing'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isArabic
                  ? 'إرسال الإيصالات فوراً إلى الطابعة الحرارية بدون إظهار نافذة الطباعة الخاصة بالمتصفح'
                  : 'Automatically send receipts directly to thermal printer without showing print preview dialog'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={directPrintEnabled}
                onChange={(e) => handleDirectPrintToggle(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-sky-600"></div>
            </label>
          </div>

          {/* Paper Size & Copies Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-600" />
                <span>{isArabic ? 'مقاس ورق الإيصالات (Paper Width)' : 'Receipt Paper Width'}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handlePaperSizeChange('80mm')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                    paperSize === '80mm'
                      ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-[#223049] bg-white dark:bg-[#0B0F17] text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>80 مم (80mm)</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {isArabic ? 'القياسي لطابعات الكاشير' : 'Standard POS'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePaperSizeChange('58mm')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                    paperSize === '58mm'
                      ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-[#223049] bg-white dark:bg-[#0B0F17] text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>58 مم (58mm)</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {isArabic ? 'الطابعات المدمجة والصغيرة' : 'Compact Mobile'}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isArabic ? 'عدد النسخ المطبوعة تلقائياً' : 'Default Print Copies'}
              </label>
              <select
                value={copies}
                onChange={(e) => handleCopiesChange(Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-hidden"
              >
                <option value={1}>{isArabic ? 'نسخة واحدة (للعميل)' : '1 Copy (Customer)'}</option>
                <option value={2}>{isArabic ? 'نسختان (نسخة عميل + نسخة صيدلية)' : '2 Copies (Customer + Pharmacy)'}</option>
                <option value={3}>{isArabic ? '3 نسخ' : '3 Copies'}</option>
              </select>
            </div>
          </div>

          {/* Printer List / Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isArabic ? 'الطابعات المتصلة المكتشفة على النظام' : 'Discovered System Printers'}
              </label>
              <span className="text-[11px] text-slate-400">
                {printers.length} {isArabic ? 'طابعة متاحة' : 'printers found'}
              </span>
            </div>

            {printers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {printers.map((p) => {
                  const isSelected = selectedPrinter === p.name;
                  return (
                    <div
                      key={p.name}
                      onClick={() => handleSelectPrinter(p.name)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/70 dark:bg-sky-950/30 ring-2 ring-sky-500/20'
                          : 'border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#131B2A]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2.5 rounded-xl ${
                            isSelected
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          <Printer className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {p.displayName || p.name}
                            </p>
                            {p.isDefault && (
                              <Badge variant="info">
                                {isArabic ? 'الافتراضية في الويندوز' : 'System Default'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {p.description || (isArabic ? 'طابعة محلية متصلة' : 'Local Connected Printer')}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : isElectron ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-[#0B0F17] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <Printer className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {isArabic ? 'لم يتم العثور على طابعات متصلة' : 'No connected printers detected'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isArabic
                    ? 'تأكد من توصيل الطابعة الحرارية بكابل USB أو الشبكة المحلية والضغط على إعادة الاكتشاف'
                    : 'Ensure your thermal printer is connected via USB/LAN and click Refresh'}
                </p>
              </div>
            ) : null}
          </div>

          {/* Test Print Action Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              <span>{isArabic ? 'الطابعة المحددة حالياً:' : 'Active POS Printer:'} </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {selectedPrinter || (isArabic ? 'الطابعة الافتراضية' : 'Default Printer')} ({paperSize})
              </span>
            </div>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleTestPrint}
              isLoading={isTesting}
              leftIcon={<Play className="w-4 h-4" />}
              className="shadow-md shadow-sky-600/20"
            >
              {isArabic ? 'اختبار طباعة إيصال تجريبي' : 'Test Print Receipt'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
