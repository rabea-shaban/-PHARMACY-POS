import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useActiveBranch } from '../../branches/hooks/useActiveBranch.js';
import { Branch } from '../../branches/types/branch.types.js';
import {
  Store,
  CheckCircle2,
  Building2,
  MapPin,
  Phone,
  ArrowRightLeft,
  ExternalLink,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button.js';

export const BranchSettingsTab: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();
  const { activeBranch, branches, canSwitchBranch, switchBranch, isLoading } = useActiveBranch();

  if (isLoading && branches.length === 0) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-2xl" />
          <div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Active Branch Highlight Card */}
      <div className="p-6 rounded-3xl bg-linear-to-br from-sky-500/10 via-sky-500/5 to-transparent border border-sky-500/20 dark:border-sky-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/20 shrink-0">
              <Store className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                  {isAr ? 'الفرع النشط حالياً لهذا الجهاز / الجلسة' : 'Current Active Branch for this Device'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {isAr ? 'نشط ومتصل' : 'Active & Online'}
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {activeBranch?.name || (isAr ? 'اختر الفرع' : 'Select Branch')}
                {activeBranch?.code && (
                  <span className="text-sm font-mono font-bold text-slate-400 dark:text-slate-500 ml-2">
                    ({activeBranch.code})
                  </span>
                )}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                {activeBranch?.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    <span>{activeBranch.address}</span>
                  </span>
                )}
                {activeBranch?.phone && (
                  <span className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-sky-500" />
                    <span>{activeBranch.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/branches')}
              leftIcon={<ExternalLink className="w-4 h-4" />}
            >
              {isAr ? 'إدارة جميع الفروع' : 'Manage All Branches'}
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-sky-500/10 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            {isAr
              ? 'يتم توجيه جميع عمليات البيع من نقطة البيع (POS) وحركات المخزون إلى هذا الفرع تلقائياً.'
              : 'All POS sales, cashier receipts, and direct inventory deductions are automatically routed to this active branch.'}
          </span>
        </div>
      </div>

      {/* 2. Switch Branch Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isAr ? 'اختر الفرع النشط للتشغيل (Switch Active Branch)' : 'Switch Active Operating Branch'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? 'يمكنك التبديل بين الفروع المتاحة لتسجيل المبيعات وفحص المخزون فورياً'
                : 'Select from available branches to switch your active operating context'}
            </p>
          </div>

          <span className="text-xs font-bold text-slate-400">
            {branches.length} {isAr ? 'فروع مسجلة' : 'branches registered'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch: Branch) => {
            const isSelected = activeBranch?.id === branch.id;
            return (
              <div
                key={branch.id}
                className={`p-5 rounded-2xl border transition-all relative ${
                  isSelected
                    ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-500 dark:border-sky-500/80 shadow-md ring-2 ring-sky-500/20'
                    : 'bg-white dark:bg-[#131B2A] border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 dark:bg-[#1A2639] text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {branch.name}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        {branch.code}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'الفرع النشط' : 'Active'}</span>
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  {branch.address && (
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{branch.address}</span>
                    </div>
                  )}
                  {branch.phone && (
                    <div className="flex items-center gap-1.5 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{branch.phone}</span>
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  {isSelected ? (
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                      {isAr ? '✓ قيد التشغيل حالياً' : '✓ Currently in use'}
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => switchBranch(branch)}
                      disabled={!canSwitchBranch}
                      className="w-full text-xs"
                    >
                      {isAr ? 'تعيين كفرع نشط حالياً' : 'Set as Active Branch'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Links to Multi-Branch Operations */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#131B2A] border border-slate-200 dark:border-[#1E293B]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          {isAr ? 'روابط سريعة لعمليات الفروع' : 'Multi-Branch Quick Links'}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => navigate('/branches')}
            className="p-3.5 rounded-xl bg-white dark:bg-[#0E1522] border border-slate-200 dark:border-[#1E293B] hover:border-sky-500 dark:hover:border-sky-500 transition-all text-right flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-white">
                  {isAr ? 'سجل وإدارة الفروع' : 'Branches Registry'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isAr ? 'إضافة وتعديل الفروع' : 'Create & Edit Branches'}
                </div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/inventory/matrix')}
            className="p-3.5 rounded-xl bg-white dark:bg-[#0E1522] border border-slate-200 dark:border-[#1E293B] hover:border-sky-500 dark:hover:border-sky-500 transition-all text-right flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-white">
                  {isAr ? 'مصفوفة المخزون بالفروع' : 'Branch Inventory Matrix'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isAr ? 'مقارنة أرصدة الأدوية' : 'Compare Cross-Branch Stock'}
                </div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/transfers')}
            className="p-3.5 rounded-xl bg-white dark:bg-[#0E1522] border border-slate-200 dark:border-[#1E293B] hover:border-sky-500 dark:hover:border-sky-500 transition-all text-right flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-white">
                  {isAr ? 'التحويلات المخزنية' : 'Stock Transfers'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isAr ? 'أوامر النقل بين الفروع' : 'Branch-to-Branch Transfers'}
                </div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
