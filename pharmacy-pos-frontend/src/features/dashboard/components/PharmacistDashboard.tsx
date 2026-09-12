import React from 'react';
import { useAppSelector } from '../../../store/hooks.js';
import { KPICard } from './KPICard.js';
import { useDashboardKPIs } from '../hooks/useDashboard.js';
import { formatCurrency } from '../../../lib/utils.js';
import {
  ShoppingCart,
  Receipt,
  RotateCcw,
  Users,
  DollarSign,
  AlertTriangle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { RecentSales } from './RecentSales.js';
import { LowStockWidget } from './LowStockWidget.js';

export const PharmacistDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: kpis, isLoading } = useDashboardKPIs();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Large POS Hero Banner */}
      <Card className="rounded-3xl border-sky-200 dark:border-sky-800 bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-lg shadow-sky-600/20 overflow-hidden relative">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center sm:text-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
              💊 وردية الصيدلي الكاشير — {user?.branch?.name || 'الفرع'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              جاهز لبدء عمليات البيع وصرف الأدوية؟
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              نظام الكاشير السريع مزود بالبحث الفوري، دعم قارئ الباركود، حساب التأمين الصحي، وتطبيق الخصومات ونقاط الولاء.
            </p>
          </div>

          <Link to="/pos" className="shrink-0 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto bg-white text-sky-900 hover:bg-sky-50 font-black shadow-lg"
              rightIcon={<ArrowRight className="w-5 h-5 rtl:rotate-180" />}
            >
              <ShoppingCart className="w-5 h-5 me-2 text-sky-600" />
              فتح نقطة البيع (POS)
            </Button>
          </Link>
        </div>
      </Card>

      {/* 2. Pharmacist Shift KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="مبيعات الوردية اليوم"
          value={formatCurrency(kpis?.todayRevenue ?? 0)}
          subtitle={`عدد الفواتير المنفذة: ${kpis?.invoiceCount ?? 0}`}
          icon={DollarSign}
          variant="primary"
          isLoading={isLoading}
        />
        <KPICard
          title="فواتير البيع المكتملة"
          value={`${kpis?.todaySales ?? 0} فاتورة`}
          subtitle={`متوسط الفاتورة: ${formatCurrency(kpis?.averageInvoiceValue ?? 0)}`}
          icon={Receipt}
          variant="success"
          isLoading={isLoading}
        />
        <KPICard
          title="نواقص أدوية الصيدلية"
          value={`${kpis?.lowStockCount ?? 0} صنف`}
          subtitle="تنبيه قبل نفاد الرصيد"
          icon={AlertTriangle}
          variant={kpis?.lowStockCount && kpis.lowStockCount > 0 ? 'warning' : 'info'}
          isLoading={isLoading}
        />
        <KPICard
          title="أدوية تستوجب الصرف السريع"
          value={`${kpis?.expiringSoonCount ?? 0} عبوة`}
          subtitle="صلاحيات قريبة (FEFO)"
          icon={Clock}
          variant={kpis?.expiringSoonCount && kpis.expiringSoonCount > 0 ? 'danger' : 'info'}
          isLoading={isLoading}
        />
      </div>

      {/* 3. Cashier Quick Access Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
        <Link
          to="/pos"
          className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 transition-all border border-emerald-200/60 dark:border-emerald-800/40"
        >
          <div className="p-2.5 rounded-xl bg-white dark:bg-black/20 text-emerald-600">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black">نقطة البيع (POS)</div>
            <div className="text-[11px] opacity-75 font-normal">شاشة الكاشير السريعة</div>
          </div>
        </Link>

        <Link
          to="/sales"
          className="flex items-center gap-3 p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-200 transition-all border border-sky-200/60 dark:border-sky-800/40"
        >
          <div className="p-2.5 rounded-xl bg-white dark:bg-black/20 text-sky-600">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black">فواتير المبيعات</div>
            <div className="text-[11px] opacity-75 font-normal">استعراض وطباعة الفواتير</div>
          </div>
        </Link>

        <Link
          to="/returns"
          className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 transition-all border border-rose-200/60 dark:border-rose-800/40"
        >
          <div className="p-2.5 rounded-xl bg-white dark:bg-black/20 text-rose-600">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black">المرتجعات</div>
            <div className="text-[11px] opacity-75 font-normal">إرجاع أصناف واسترداد</div>
          </div>
        </Link>

        <Link
          to="/customers"
          className="flex items-center gap-3 p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-200 transition-all border border-purple-200/60 dark:border-purple-800/40"
        >
          <div className="p-2.5 rounded-xl bg-white dark:bg-black/20 text-purple-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black">بيانات العملاء</div>
            <div className="text-[11px] opacity-75 font-normal">نقاط الولاء والتأمين</div>
          </div>
        </Link>
      </div>

      {/* 4. Recent Sales & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSales />
        <LowStockWidget />
      </div>
    </div>
  );
};
