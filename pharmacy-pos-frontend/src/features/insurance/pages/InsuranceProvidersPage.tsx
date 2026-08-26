import React, { useState } from 'react';
import { useInsuranceProviders } from '../hooks/useInsurance.js';
import { useSales } from '../../sales/hooks/useSales.js';
import { InsuranceProvider, InsuranceClaimRecord } from '../types/insurance.types.js';
import { InsuranceProviderList } from '../components/InsuranceProviderList.js';
import { CreateInsuranceProviderModal } from '../components/CreateInsuranceProviderModal.js';
import { EditInsuranceProviderModal } from '../components/EditInsuranceProviderModal.js';
import { InsuranceClaimsTable } from '../components/InsuranceClaimsTable.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Input } from '../../../components/ui/Input.js';
import { formatCurrency } from '../../../lib/utils.js';
import { useAppSelector } from '../../../store/hooks.js';
import {
  ShieldPlus,
  Building2,
  Plus,
  Search,
  Percent,
  Receipt,
  Coins,
  FileSpreadsheet,
} from 'lucide-react';

type InsuranceTabKey = 'providers' | 'claims';

export const InsuranceProvidersPage: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<InsuranceTabKey>('providers');

  // Filters & State for Providers
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<InsuranceProvider | null>(null);

  const canCreate = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'].includes(role);

  // Queries
  const { data: providersData, isLoading: isLoadingProviders } = useInsuranceProviders({
    page,
    limit: 20,
    search: search || undefined,
    isActive: statusFilter,
  });

  const { data: salesData, isLoading: isLoadingSales } = useSales({
    page: 1,
    limit: 100,
  });

  const providers = providersData?.items || [];
  const pagination = providersData?.pagination;

  // Derive Insurance Claims from Real Sales Data
  const claims: InsuranceClaimRecord[] = (salesData?.items || [])
    .filter((s: any) => s.insuranceAmount > 0 && s.insurance)
    .map((s: any) => ({
      saleId: s.id,
      invoiceNumber: s.invoiceNumber,
      saleDate: s.createdAt,
      customerName: s.customer?.name || 'عميل نقدي / تأمين',
      customerPhone: s.customer?.phone || undefined,
      providerName: s.insurance.providerName || 'شركة التأمين',
      claimReference: s.insurance.claimReference || `CLM-${s.invoiceNumber}`,
      coveredAmount: Number(s.insurance.coveredAmount || s.insuranceAmount),
      customerAmount: Number(s.insurance.customerAmount || s.totalAmount),
      coveragePercentage: Number(s.insurance.coveragePercentage || 80),
      totalSaleAmount: Number(s.totalAmount) + Number(s.insuranceAmount),
      cashierName: s.cashier?.name || undefined,
    }));

  // KPI Metrics Calculation from Real Data
  const activeProvidersCount = providers.filter((p) => p.isActive).length;
  const totalClaimsCount = claims.length;
  const totalCoveredAmount = claims.reduce((acc, c) => acc + c.coveredAmount, 0);
  const totalCustomerCopay = claims.reduce((acc, c) => acc + c.customerAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShieldPlus className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <span>منظومة التأمين الطبي والشركات (Insurance & Claims Billing)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            إدارة تعاقدات شركات التأمين الصحي (TPA)، بوالص العملاء، نسب التغطية، وإصدار سندات المطالبات
          </p>
        </div>

        {canCreate && (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-md shadow-teal-600/20"
          >
            إضافة شركة تأمين جديدة
          </Button>
        )}
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-3xl border-slate-200/80 dark:border-[#1E293B] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">شركات التأمين النشطة</span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                {activeProvidersCount} <span className="text-xs font-normal text-slate-400">جهة معتمدة</span>
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-3xl border-slate-200/80 dark:border-[#1E293B] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">عدد المطالبات الصادرة</span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                {totalClaimsCount} <span className="text-xs font-normal text-slate-400">مطالبة</span>
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-3xl border-slate-200/80 dark:border-[#1E293B] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">إجمالي مبالغ التأمين المغطاة</span>
              <span className="text-lg font-black text-emerald-600 font-mono">
                {formatCurrency(totalCoveredAmount)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-3xl border-slate-200/80 dark:border-[#1E293B] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">مبالغ تحمل المرضى (Co-Pay)</span>
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {formatCurrency(totalCustomerCopay)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-[#1E293B] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('providers')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'providers'
              ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>شركات وهيئات التأمين (Insurance Providers)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('claims')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'claims'
              ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>سجل وسندات المطالبات التأمينية (Claims Ledger)</span>
        </button>
      </div>

      {/* Tab 1: Providers Directory */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          {/* Filters Toolbar */}
          <Card className="p-4 rounded-3xl shadow-xs border-slate-200/80 dark:border-[#1E293B]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                placeholder="بحث باسم شركة التأمين..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />

              <select
                value={statusFilter === undefined ? '' : statusFilter ? 'true' : 'false'}
                onChange={(e) => {
                  const val = e.target.value;
                  setStatusFilter(val === '' ? undefined : val === 'true');
                  setPage(1);
                }}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-[#223049] text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-hidden"
              >
                <option value="">كافة الحالات (نشطة وغير نشطة)</option>
                <option value="true">الشركات المعتمدة والنشطة فقط</option>
                <option value="false">الشركات الموقوفة / غير النشطة</option>
              </select>

              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setSearch('');
                  setStatusFilter(undefined);
                  setPage(1);
                }}
              >
                إعادة ضبط الفلاتر
              </Button>
            </div>
          </Card>

          {/* Providers Table Card */}
          <Card className="rounded-3xl shadow-xs overflow-hidden border-slate-200/80 dark:border-[#1E293B]">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-[#1E293B]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  دليل تعاقدات شركات التأمين الصحي
                </CardTitle>
                {pagination && (
                  <span className="text-xs font-mono text-slate-500">
                    إجمالي: {pagination.total} شركة
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <InsuranceProviderList
                providers={providers}
                isLoading={isLoadingProviders}
                onEditProvider={(provider) => setEditingProvider(provider)}
              />

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    السابق
                  </Button>

                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
                    صفحة {pagination.page} من {pagination.totalPages}
                  </span>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    التالي
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Claims Ledger */}
      {activeTab === 'claims' && (
        <Card className="rounded-3xl shadow-xs overflow-hidden border-slate-200/80 dark:border-[#1E293B] p-5">
          <InsuranceClaimsTable claims={claims} isLoading={isLoadingSales} />
        </Card>
      )}

      {/* Modals */}
      <CreateInsuranceProviderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditInsuranceProviderModal
        provider={editingProvider}
        isOpen={Boolean(editingProvider)}
        onClose={() => setEditingProvider(null)}
      />
    </div>
  );
};
