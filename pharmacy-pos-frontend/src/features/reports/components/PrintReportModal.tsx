import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/ui/Modal.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import {
  Printer,
  FileSpreadsheet,
  TrendingUp,
  Pill,
  Boxes,
  Truck,
  Wallet,
  Users,
  Award,
  Landmark,
  Calendar,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { formatDate } from '../../../lib/utils.js';
import { useAppSelector } from '../../../store/hooks.js';

export type ReportTypeKey =
  | 'sales'
  | 'products'
  | 'inventory'
  | 'purchases'
  | 'expenses'
  | 'customers'
  | 'staff'
  | 'financial-summary';

export interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReportType: ReportTypeKey;
  initialFrom?: string;
  initialTo?: string;
  onSelectAndPrint: (
    reportType: ReportTypeKey,
    from: string,
    to: string,
    options: {
      includeCharts: boolean;
      includeSignatures: boolean;
    }
  ) => void;
}

interface ReportOptionDef {
  key: ReportTypeKey;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'financial' | 'operational' | 'inventory';
}

const REPORT_OPTIONS: ReportOptionDef[] = [
  {
    key: 'sales',
    title: 'تقرير المبيعات الشامل وحركة الإيراد',
    description: 'إجمالي المبيعات، الصافي، المرتجعات، وتوزيع طرق الدفع',
    icon: <TrendingUp className="w-5 h-5 text-sky-600" />,
    category: 'financial',
  },
  {
    key: 'products',
    title: 'تقرير حركة وأداء الأدوية والركود',
    description: 'الأكثر مبيعاً، الأصناف بطيئة الحركة، والراكدة (صفر مبيعات)',
    icon: <Pill className="w-5 h-5 text-indigo-600" />,
    category: 'operational',
  },
  {
    key: 'inventory',
    title: 'تقرير تقييم المخزون وصحة الصلاحيات',
    description: 'تقييم رأس المال بالتكلفة والبيع، صلاحيات 90 يوم، وحد الطلب',
    icon: <Boxes className="w-5 h-5 text-emerald-600" />,
    category: 'inventory',
  },
  {
    key: 'purchases',
    title: 'تقرير المشتريات والتوريد وحسابات الموردين',
    description: 'حجم التوريد، المبالغ المسددة والمتبقية كآجل، وإنفاق الموردين',
    icon: <Truck className="w-5 h-5 text-purple-600" />,
    category: 'operational',
  },
  {
    key: 'expenses',
    title: 'تقرير المصروفات والتدفقات النقدية',
    description: 'تحليل المصروفات التشغيلية وبنود الإيجار والكهرباء والصيانة',
    icon: <Wallet className="w-5 h-5 text-rose-600" />,
    category: 'financial',
  },
  {
    key: 'customers',
    title: 'تقرير العملاء وبرامج ونقاط الولاء',
    description: 'أعلى العملاء شراءً، متوسط الإنفاق، ورصيد النقاط المستبدلة',
    icon: <Users className="w-5 h-5 text-amber-600" />,
    category: 'operational',
  },
  {
    key: 'staff',
    title: 'تقرير إنتاجية الصيادلة والعمولات البيعية',
    description: 'مبيعات كل صيدلي، الفواتير، وحوافز العمولات المستحقة الصرف',
    icon: <Award className="w-5 h-5 text-sky-600" />,
    category: 'financial',
  },
  {
    key: 'financial-summary',
    title: 'القوائم المالية التنفيذية وقائمة الدخل (P&L)',
    description: 'صافي الفائض التشغيلي، هامش الربح، والمؤشرات المالية الكلية',
    icon: <Landmark className="w-5 h-5 text-emerald-600" />,
    category: 'financial',
  },
];

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  initialReportType,
  initialFrom = '',
  initialTo = '',
  onSelectAndPrint,
}) => {
  const { t } = useTranslation();
  const { role } = useAppSelector((state) => state.auth);

  const [selectedReport, setSelectedReport] = useState<ReportTypeKey>(initialReportType);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);

  const isManagerOrAccountant = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'].includes(role);

  const allowedReports = REPORT_OPTIONS.filter((opt) => {
    if (['purchases', 'expenses', 'staff', 'financial-summary'].includes(opt.key)) {
      return isManagerOrAccountant;
    }
    return true;
  });

  const selectedReportDef = allowedReports.find((r) => r.key === selectedReport) || allowedReports[0];

  const handlePreset = (preset: 'today' | 'thisMonth' | 'lastMonth' | 'all') => {
    const now = new Date();
    if (preset === 'today') {
      const today = now.toISOString().split('T')[0];
      setFrom(today);
      setTo(today);
    } else if (preset === 'thisMonth') {
      const first = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      setFrom(first);
      setTo(last);
    } else if (preset === 'lastMonth') {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      const last = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
      setFrom(first);
      setTo(last);
    } else if (preset === 'all') {
      setFrom('');
      setTo('');
    }
  };

  const handleExecutePrint = () => {
    onSelectAndPrint(selectedReport, from, to, {
      includeCharts,
      includeSignatures,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="مركز طباعة واستخراج التقارير المالية والتشغيلية"
      maxWidth="xl"
    >
      <div className="space-y-6 text-xs text-start">
        {/* Step 1: Select Target Report */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
              <FileSpreadsheet className="w-4 h-4 text-sky-600" />
              <span>1. اختر نوع التقرير المراد طباعته:</span>
            </span>
            <span className="text-[11px] text-slate-400 font-bold">
              (متاح {allowedReports.length} تقارير معتمدة)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">
            {allowedReports.map((opt) => {
              const isSelected = selectedReport === opt.key;
              return (
                <div
                  key={opt.key}
                  onClick={() => setSelectedReport(opt.key)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 text-start ${
                    isSelected
                      ? 'border-sky-600 bg-sky-50/80 dark:bg-sky-950/40 dark:border-sky-500 ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639]'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isSelected
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 dark:bg-[#0B0F17] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {opt.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-black text-slate-900 dark:text-white text-xs truncate">
                        {opt.title}
                      </p>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {opt.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Date Range Selection */}
        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>2. تحديد النطاق الزمني للتقرير:</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handlePreset('thisMonth')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300 hover:bg-sky-200 cursor-pointer"
              >
                الشهر الحالي
              </button>
              <button
                type="button"
                onClick={() => handlePreset('lastMonth')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300 cursor-pointer"
              >
                الشهر السابق
              </button>
              <button
                type="button"
                onClick={() => handlePreset('today')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300 cursor-pointer"
              >
                اليوم
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="date"
              label="من تاريخ"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
            />

            <Input
              type="date"
              label="إلى تاريخ"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>

        {/* Step 3: Print Document Inclusions */}
        <div>
          <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>3. خيارات وتنسيق المستند المطبوع:</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] cursor-pointer">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  تضمين الرسوم والمنحنيات البيانية
                </span>
                <span className="text-[10px] text-slate-400">
                  عرض المخططات التحليلية في صدر التقرير
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-200 dark:border-[#223049] hover:bg-slate-50 dark:hover:bg-[#1A2639] cursor-pointer">
              <input
                type="checkbox"
                checked={includeSignatures}
                onChange={(e) => setIncludeSignatures(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  تضمين خانات الاعتماد والتوقيع الرسمي
                </span>
                <span className="text-[10px] text-slate-400">
                  توقيع المحاسب وإدارة الصيدلية وتدقيق البيانات
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Live Print Document Preview Card */}
        <div className="p-4 rounded-3xl bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>معاينة المستند الرسمي الجاهز للطباعة:</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              A4 Landscape / Portrait
            </span>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <div>
              <p className="font-black text-sm">{selectedReportDef?.title}</p>
              <p className="text-xs text-slate-300 mt-0.5">
                الفترة: {from ? formatDate(from) : 'من البداية'} إلى {to ? formatDate(to) : 'تاريخه'}
              </p>
            </div>

            <div className="text-end font-mono text-xs text-emerald-400 font-black">
              ✓ جاهز للتصدير والطباعة
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1E293B]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {t('common.cancel')}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleExecutePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            بدء الطباعة الرسمية الآن (Print Document)
          </Button>
        </div>
      </div>
    </Modal>
  );
};
