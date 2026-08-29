import React, { useState } from 'react';
import { useAllSettings } from '../hooks/useSettings.js';
import { PharmacyProfileForm } from '../components/PharmacyProfileForm.js';
import { TaxSettingsForm } from '../components/TaxSettingsForm.js';
import { InvoiceSettingsForm } from '../components/InvoiceSettingsForm.js';
import { GeneralSettingsForm } from '../components/GeneralSettingsForm.js';
import { BrandingPreview } from '../components/BrandingPreview.js';
import { WhatsAppSettingsTab } from '../components/WhatsAppSettingsTab.js';
import { PrinterSettingsTab } from '../components/PrinterSettingsTab.js';
import {
  Settings as SettingsIcon,
  Building2,
  Percent,
  Printer,
  FileText,
  Sliders,
  Sparkles,
  Smartphone,
  ShieldAlert,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

type SettingsTabKey = 'pharmacy' | 'tax' | 'invoices' | 'printers' | 'general' | 'branding' | 'whatsapp';

export const SettingsPage: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<SettingsTabKey>('pharmacy');

  const { data, isLoading } = useAllSettings();

  const isManager = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);
  const isReadOnly = !isManager; // Accountants can view but not modify

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl w-1/3" />
        <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-3xl" />
      </div>
    );
  }

  const settingsMap = data?.map || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>إعدادات النظام والضرائب وهوية الصيدلية (System Settings & Branding)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إدارة الهوية القانونية، ضريبة القيمة المضافة، ترقيم الفواتير، الطباعة الحرارية، وبوابة الواتساب
          </p>
        </div>

        {isReadOnly && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>وضع الاطلاع فقط (صلاحيات القراءة للمحاسب)</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-[#1E293B] flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('pharmacy')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'pharmacy'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>هوية وبيانات الصيدلية</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tax')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'tax'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>الضرائب و (VAT)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'invoices'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ترقيم الفواتير والنمط</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('printers')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'printers'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>طابعات نقاط البيع (POS Printers)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'general'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>المعايير والتنبيهات</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'branding'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>معاينة الهوية والإيصال</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'whatsapp'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>بوابة الواتساب</span>
        </button>
      </div>

      {/* Active Tab Content */}
      <div>
        {activeTab === 'pharmacy' && (
          <PharmacyProfileForm settingsMap={settingsMap} isReadOnly={isReadOnly} />
        )}
        {activeTab === 'tax' && (
          <TaxSettingsForm settingsMap={settingsMap} isReadOnly={isReadOnly} />
        )}
        {activeTab === 'invoices' && (
          <InvoiceSettingsForm settingsMap={settingsMap} isReadOnly={isReadOnly} />
        )}
        {activeTab === 'printers' && <PrinterSettingsTab />}
        {activeTab === 'general' && (
          <GeneralSettingsForm settingsMap={settingsMap} isReadOnly={isReadOnly} />
        )}
        {activeTab === 'branding' && <BrandingPreview settingsMap={settingsMap} />}
        {activeTab === 'whatsapp' && <WhatsAppSettingsTab />}
      </div>
    </div>
  );
};
