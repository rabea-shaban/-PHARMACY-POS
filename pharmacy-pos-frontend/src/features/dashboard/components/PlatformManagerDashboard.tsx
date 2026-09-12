import React from 'react';
import { KPICard } from './KPICard.js';
import { useDashboardKPIs } from '../hooks/useDashboard.js';
import { formatCurrency } from '../../../lib/utils.js';
import {
  ShieldCheck,
  Store,
  DollarSign,
  AlertTriangle,
  Clock,
  Settings,
  UsersRound,
  LayoutGrid,
  Landmark,
  ShoppingCart,
  FileSpreadsheet,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { BranchPerformanceWidget } from './BranchPerformanceWidget.js';
import { FinancialHealthWidget } from './FinancialHealthWidget.js';
import { BranchTransfersWidget } from './BranchTransfersWidget.js';
import { SalesChart } from './SalesChart.js';
import { RecentSales } from './RecentSales.js';
import { LowStockWidget } from './LowStockWidget.js';
import { ExpiryAlertsWidget } from './ExpiryAlertsWidget.js';

export const PlatformManagerDashboard: React.FC = () => {
  const { data: kpis, isLoading } = useDashboardKPIs();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Platform Master KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="إجمالي مبيعات المنصة والسلسلة"
          value={formatCurrency(kpis?.todayRevenue ?? 0)}
          subtitle={`إجمالي الفواتير: ${kpis?.invoiceCount ?? 0}`}
          icon={DollarSign}
          variant="primary"
          isLoading={isLoading}
        />
        <KPICard
          title="الطلبات والعمليات اليومية"
          value={`${kpis?.todaySales ?? 0} فاتورة`}
          subtitle={`متوسط السلة: ${formatCurrency(kpis?.averageInvoiceValue ?? 0)}`}
          icon={Store}
          variant="success"
          isLoading={isLoading}
        />
        <KPICard
          title="نواقص المخزون الشاملة"
          value={`${kpis?.lowStockCount ?? 0} صنف`}
          subtitle="أصناف بحاجة لإعادة التزويد"
          icon={AlertTriangle}
          variant={kpis?.lowStockCount && kpis.lowStockCount > 0 ? 'warning' : 'info'}
          isLoading={isLoading}
        />
        <KPICard
          title="تنبيهات الصلاحية (FEFO)"
          value={`${kpis?.expiringSoonCount ?? 0} عبوة`}
          subtitle="تشغيلات تستوجب الصرف السريع"
          icon={Clock}
          variant={kpis?.expiringSoonCount && kpis.expiringSoonCount > 0 ? 'danger' : 'info'}
          isLoading={isLoading}
        />
      </div>

      {/* 2. Platform Admin Quick Actions */}
      <Card className="rounded-3xl shadow-xs border-slate-200/80 dark:border-[#223049]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>التحكم الإداري والتقني الشامل (Super Admin)</span>
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            الوصول الكامل لإعدادات المنصة، الفروع، المستخدمين، الأمان، والنسخ الاحتياطي
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
            <Link
              to="/pos"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="leading-tight">نقطة البيع</span>
            </Link>

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
              to="/finance"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="leading-tight">شجرة الحسابات</span>
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
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="leading-tight">سجل التدقيق</span>
            </Link>

            <Link
              to="/settings"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <span className="leading-tight">إعدادات النظام</span>
            </Link>

            <Link
              to="/reports"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="leading-tight">التقارير الشاملة</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 3. Branch Comparison & Financial Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BranchPerformanceWidget />
        <FinancialHealthWidget />
      </div>

      {/* 4. Sales Trends & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <RecentSales />
        </div>
      </div>

      {/* 5. Transfers */}
      <div>
        <BranchTransfersWidget />
      </div>

      {/* 6. Inventory Reorder Alerts & FEFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LowStockWidget />
        <ExpiryAlertsWidget />
      </div>
    </div>
  );
};
