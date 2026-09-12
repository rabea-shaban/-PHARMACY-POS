import React from 'react';
import { KPICard } from './KPICard.js';
import { useDashboardKPIs } from '../hooks/useDashboard.js';
import { formatCurrency } from '../../../lib/utils.js';
import { Store, DollarSign, AlertTriangle, Clock, LayoutGrid, ArrowLeftRight, Landmark, UsersRound, ShieldCheck, ScrollText, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { BranchPerformanceWidget } from './BranchPerformanceWidget.js';
import { FinancialHealthWidget } from './FinancialHealthWidget.js';
import { BranchTransfersWidget } from './BranchTransfersWidget.js';
import { LowStockWidget } from './LowStockWidget.js';
import { ExpiryAlertsWidget } from './ExpiryAlertsWidget.js';
import { SalesChart } from './SalesChart.js';

export const PharmacyManagerDashboard: React.FC = () => {
  const { data: kpis, isLoading } = useDashboardKPIs();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Executive Multi-Branch KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="إجمالي مبيعات فروع السلسلة"
          value={formatCurrency(kpis?.todayRevenue ?? 0)}
          subtitle={`عدد الفواتير الصادرة: ${kpis?.invoiceCount ?? 0}`}
          icon={DollarSign}
          variant="primary"
          isLoading={isLoading}
        />
        <KPICard
          title="فواتير وطلبات كافة الفروع"
          value={`${kpis?.todaySales ?? 0} فاتورة`}
          subtitle={`متوسط سلة المشتريات: ${formatCurrency(kpis?.averageInvoiceValue ?? 0)}`}
          icon={Store}
          variant="success"
          isLoading={isLoading}
        />
        <KPICard
          title="نواقص المخزون الكلية عبر الفروع"
          value={`${kpis?.lowStockCount ?? 0} صنف`}
          subtitle="أصناف بلغت الحد الأدنى لإعادة الطلب"
          icon={AlertTriangle}
          variant={kpis?.lowStockCount && kpis.lowStockCount > 0 ? 'warning' : 'info'}
          isLoading={isLoading}
        />
        <KPICard
          title="تشغيلات تقترب من الانتهاء (FEFO)"
          value={`${kpis?.expiringSoonCount ?? 0} عبوة`}
          subtitle="تستوجب الرقابة والصرف السريع"
          icon={Clock}
          variant={kpis?.expiringSoonCount && kpis.expiringSoonCount > 0 ? 'danger' : 'info'}
          isLoading={isLoading}
        />
      </div>

      {/* 2. Executive Quick Management Actions */}
      <Card className="rounded-3xl shadow-xs border-slate-200/80 dark:border-[#223049]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>مركز العمليات والرقابة الإدارية</span>
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            الوصول الفوري والمباشر لإدارة الفروع، المخزون الموزع، الحسابات، والكادر الإداري
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
            <Link
              to="/branches"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <span className="leading-tight">إدارة الفروع</span>
            </Link>

            <Link
              to="/inventory/matrix"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <span className="leading-tight">مصفوفة المخزون</span>
            </Link>

            <Link
              to="/transfers"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <span className="leading-tight">تحويلات الأدوية</span>
            </Link>

            <Link
              to="/inventory/ledger"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <ScrollText className="w-5 h-5" />
              </div>
              <span className="leading-tight">تتبع حركة الأدوية</span>
            </Link>

            <Link
              to="/finance"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="leading-tight">شجرة الحسابات</span>
            </Link>

            <Link
              to="/expenses"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="leading-tight">المصروفات</span>
            </Link>

            <Link
              to="/users"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <UsersRound className="w-5 h-5" />
              </div>
              <span className="leading-tight">إدارة الموظفين</span>
            </Link>

            <Link
              to="/audit"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="leading-tight">سجل الأمان</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 3. Branch Performance & Financial Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BranchPerformanceWidget />
        <FinancialHealthWidget />
      </div>

      {/* 4. Sales Trends & Inter-branch transfers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <BranchTransfersWidget />
        </div>
      </div>

      {/* 5. Inventory Reorder Alerts & FEFO Horizons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LowStockWidget />
        <ExpiryAlertsWidget />
      </div>
    </div>
  );
};
