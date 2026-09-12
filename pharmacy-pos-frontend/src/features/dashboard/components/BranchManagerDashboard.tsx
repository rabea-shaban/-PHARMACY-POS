import React from 'react';
import { useAppSelector } from '../../../store/hooks.js';
import { KPICard } from './KPICard.js';
import { useDashboardKPIs } from '../hooks/useDashboard.js';
import { formatCurrency } from '../../../lib/utils.js';
import {
  ShoppingCart,
  Store,
  DollarSign,
  AlertTriangle,
  Clock,
  ArrowLeftRight,
  Receipt,
  RotateCcw,
  Boxes,
  Wallet,
  UsersRound,
  FileSpreadsheet,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { BranchTransfersWidget } from './BranchTransfersWidget.js';
import { RecentSales } from './RecentSales.js';
import { SalesChart } from './SalesChart.js';
import { LowStockWidget } from './LowStockWidget.js';
import { ExpiryAlertsWidget } from './ExpiryAlertsWidget.js';

export const BranchManagerDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: kpis, isLoading } = useDashboardKPIs();

  const branchName = user?.branch?.name || 'الفرع';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Branch KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={`مبيعات اليوم — ${branchName}`}
          value={formatCurrency(kpis?.todayRevenue ?? 0)}
          subtitle={`عدد الفواتير المكتملة: ${kpis?.invoiceCount ?? 0}`}
          icon={DollarSign}
          variant="primary"
          isLoading={isLoading}
        />
        <KPICard
          title="فواتير وطلبات الفرع"
          value={`${kpis?.todaySales ?? 0} فاتورة`}
          subtitle={`متوسط الفاتورة: ${formatCurrency(kpis?.averageInvoiceValue ?? 0)}`}
          icon={Store}
          variant="success"
          isLoading={isLoading}
        />
        <KPICard
          title="نواقص أدوية الفرع"
          value={`${kpis?.lowStockCount ?? 0} صنف`}
          subtitle="أصناف قاربت على النفاد بالفرع"
          icon={AlertTriangle}
          variant={kpis?.lowStockCount && kpis.lowStockCount > 0 ? 'warning' : 'info'}
          isLoading={isLoading}
        />
        <KPICard
          title="أدوية الفرع قاربت على الانتهاء"
          value={`${kpis?.expiringSoonCount ?? 0} عبوة`}
          subtitle="صلاحيات تستوجب أولوية الصرف FEFO"
          icon={Clock}
          variant={kpis?.expiringSoonCount && kpis.expiringSoonCount > 0 ? 'danger' : 'info'}
          isLoading={isLoading}
        />
      </div>

      {/* 2. Branch Operations Quick Actions */}
      <Card className="rounded-3xl shadow-xs border-slate-200/80 dark:border-[#223049]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>عمليات وإدارة الفرع ({branchName})</span>
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            الوصول المباشر لنقطة البيع، فواتير المبيعات، تحويلات الأدوية، وجرد الفرع
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
            <Link
              to="/pos"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold transition-all text-center space-y-2 group shadow-xs border border-emerald-200/60 dark:border-emerald-800/40"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform text-emerald-600">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="leading-tight">نقطة البيع (الكاشير)</span>
            </Link>

            <Link
              to="/sales"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="leading-tight">فواتير المبيعات</span>
            </Link>

            <Link
              to="/returns"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <RotateCcw className="w-5 h-5" />
              </div>
              <span className="leading-tight">المرتجعات</span>
            </Link>

            <Link
              to="/inventory"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Boxes className="w-5 h-5" />
              </div>
              <span className="leading-tight">مخزون الفرع</span>
            </Link>

            <Link
              to="/transfers"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <span className="leading-tight">تحويلات الفرع</span>
            </Link>

            <Link
              to="/expenses"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="leading-tight">مصروفات الفرع</span>
            </Link>

            <Link
              to="/users"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <UsersRound className="w-5 h-5" />
              </div>
              <span className="leading-tight">صيادلة الفرع</span>
            </Link>

            <Link
              to="/reports"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="leading-tight">تقارير الفرع</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 3. Branch Sales Chart & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <RecentSales />
        </div>
      </div>

      {/* 4. Branch Transfers Widget */}
      <div>
        <BranchTransfersWidget />
      </div>

      {/* 5. Branch Inventory Low Stock & Expiry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LowStockWidget />
        <ExpiryAlertsWidget />
      </div>
    </div>
  );
};
