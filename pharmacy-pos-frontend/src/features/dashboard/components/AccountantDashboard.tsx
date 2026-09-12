import React from 'react';
import { KPICard } from './KPICard.js';
import { useDashboardKPIs } from '../hooks/useDashboard.js';
import { formatCurrency } from '../../../lib/utils.js';
import {
  Landmark,
  Wallet,
  Coins,
  Truck,
  FileSpreadsheet,
  Award,
  DollarSign,
  PlusCircle,
  Building2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card.js';
import { FinancialHealthWidget } from './FinancialHealthWidget.js';
import { SalesChart } from './SalesChart.js';
import { RecentSales } from './RecentSales.js';

export const AccountantDashboard: React.FC = () => {
  const { data: kpis, isLoading } = useDashboardKPIs();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Financial Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="صافي إيرادات المبيعات المحصلة"
          value={formatCurrency(kpis?.todayRevenue ?? 0)}
          subtitle={`عدد الفواتير الصادرة: ${kpis?.invoiceCount ?? 0}`}
          icon={DollarSign}
          variant="primary"
          isLoading={isLoading}
        />
        <KPICard
          title="متوسط قيمة الفواتير اليومية"
          value={formatCurrency(kpis?.averageInvoiceValue ?? 0)}
          subtitle={`إجمالي العمليات: ${kpis?.todaySales ?? 0} فاتورة`}
          icon={Landmark}
          variant="success"
          isLoading={isLoading}
        />
        <KPICard
          title="المصروفات والسندات التشغيلية"
          value="متابعة القيود"
          subtitle="تسجيل المصروفات والإيجارات والفواتير"
          icon={Wallet}
          variant="warning"
          isLoading={isLoading}
        />
        <KPICard
          title="مسيرات الرواتب والعمولات"
          value="دورة الأجور"
          subtitle="احتساب العمولات وصرف المستحقات"
          icon={Coins}
          variant="info"
          isLoading={isLoading}
        />
      </div>

      {/* 2. Financial Management Quick Actions */}
      <Card className="rounded-3xl shadow-xs border-slate-200/80 dark:border-[#223049]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>مركز العمليات المالية والمحاسبية</span>
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            إدارة شجرة الحسابات، قيود اليومية، فواتير الموردين، مسيرات الأجور، والتقارير المالية
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
            <Link
              to="/expenses/new"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold transition-all text-center space-y-2 group shadow-xs border border-rose-200/60 dark:border-rose-800/40"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform text-rose-600">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="leading-tight">تسجيل مصروف</span>
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
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="leading-tight">سجل المصروفات</span>
            </Link>

            <Link
              to="/purchases"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <span className="leading-tight">فواتير المشتريات</span>
            </Link>

            <Link
              to="/suppliers"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="leading-tight">حسابات الموردين</span>
            </Link>

            <Link
              to="/payroll"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Coins className="w-5 h-5" />
              </div>
              <span className="leading-tight">مسيرات الرواتب</span>
            </Link>

            <Link
              to="/commissions"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <span className="leading-tight">العمولات والحوافز</span>
            </Link>

            <Link
              to="/reports"
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition-all text-center space-y-2 group"
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-black/20 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="leading-tight">القوائم المالية</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 3. Financial Breakdown & Performance Meter */}
      <div>
        <FinancialHealthWidget />
      </div>

      {/* 4. Sales Revenue Analytics & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <RecentSales />
        </div>
      </div>
    </div>
  );
};
