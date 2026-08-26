import React, { useState } from 'react';
import {
  useSalesReport,
  useProductReport,
  useInventoryReport,
  usePurchaseReport,
  useExpenseReport,
  useCustomerReport,
  useStaffReport,
  useFinancialSummary,
} from '../hooks/useReports.js';
import { ReportPeriodFilter } from '../components/ReportPeriodFilter.js';
import { SalesReportView } from '../components/SalesReportView.js';
import { ProductReportView } from '../components/ProductReportView.js';
import { InventoryReportView } from '../components/InventoryReportView.js';
import { PurchaseReportView } from '../components/PurchaseReportView.js';
import { ExpenseReportView } from '../components/ExpenseReportView.js';
import { CustomerReportView } from '../components/CustomerReportView.js';
import { StaffReportView } from '../components/StaffReportView.js';
import { FinancialSummaryReportView } from '../components/FinancialSummaryReportView.js';
import { ReportExportActions, exportToCsv } from '../components/ReportExportActions.js';
import { ReportPrintHeader, ReportPrintFooter } from '../components/ReportPrintHeader.js';
import { PrintReportModal, ReportTypeKey } from '../components/PrintReportModal.js';
import {
  FileSpreadsheet,
  TrendingUp,
  Pill,
  Boxes,
  Truck,
  Wallet,
  Users,
  Award,
  Landmark,
} from 'lucide-react';
import { useAppSelector } from '../../../store/hooks.js';

type ReportTab =
  | 'sales'
  | 'products'
  | 'inventory'
  | 'purchases'
  | 'expenses'
  | 'customers'
  | 'staff'
  | 'financial-summary';

export const ReportsPage: React.FC = () => {
  const { role } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<ReportTab>('sales');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const filterParams = {
    from: from || undefined,
    to: to || undefined,
  };

  // Queries
  const salesQuery = useSalesReport(activeTab === 'sales' ? filterParams : undefined);
  const productsQuery = useProductReport(activeTab === 'products' ? filterParams : undefined);
  const inventoryQuery = useInventoryReport(activeTab === 'inventory' ? filterParams : undefined);
  const purchaseQuery = usePurchaseReport(activeTab === 'purchases' ? filterParams : undefined);
  const expenseQuery = useExpenseReport(activeTab === 'expenses' ? filterParams : undefined);
  const customerQuery = useCustomerReport(activeTab === 'customers' ? filterParams : undefined);
  const staffQuery = useStaffReport(activeTab === 'staff' ? filterParams : undefined);
  const financialQuery = useFinancialSummary(activeTab === 'financial-summary' ? filterParams : undefined);

  const handleResetFilters = () => {
    setFrom('');
    setTo('');
  };

  const handleExportCsv = () => {
    if (activeTab === 'sales' && salesQuery.data?.topSellingProducts) {
      exportToCsv('sales-top-products-report', salesQuery.data.topSellingProducts);
    } else if (activeTab === 'products' && productsQuery.data?.allProducts) {
      exportToCsv('products-performance-report', productsQuery.data.allProducts);
    } else if (activeTab === 'inventory' && inventoryQuery.data?.lowStockItems) {
      exportToCsv('inventory-low-stock-report', inventoryQuery.data.lowStockItems);
    } else if (activeTab === 'purchases' && purchaseQuery.data?.supplierSpendingBreakdown) {
      exportToCsv('purchases-supplier-spend-report', purchaseQuery.data.supplierSpendingBreakdown);
    } else if (activeTab === 'expenses' && expenseQuery.data?.categoryBreakdown) {
      exportToCsv('operating-expenses-report', expenseQuery.data.categoryBreakdown);
    } else if (activeTab === 'customers' && customerQuery.data?.topCustomersByRevenue) {
      exportToCsv('top-customers-revenue-report', customerQuery.data.topCustomersByRevenue);
    } else if (activeTab === 'staff' && staffQuery.data?.staffPerformance) {
      exportToCsv('staff-sales-commission-report', staffQuery.data.staffPerformance);
    }
  };

  const handleSelectAndPrint = (
    reportType: ReportTypeKey,
    selectedFrom: string,
    selectedTo: string
  ) => {
    setActiveTab(reportType);
    setFrom(selectedFrom);
    setTo(selectedTo);
    // Trigger print in next tick after React renders the selected tab
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const isManagerOrAccountant = role && ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'].includes(role);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E293B] print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>التقارير والتحليلات الشاملة (Comprehensive Reports & Analytics)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مؤشرات المبيعات، المخزون، المشتريات، المصروفات، العملاء، أداء الصيادلة، والملخص المالي
          </p>
        </div>

        <ReportExportActions
          onPrint={() => setIsPrintModalOpen(true)}
          onExportCsv={handleExportCsv}
        />
      </div>

      {/* Date Period Filter */}
      <div className="print:hidden">
        <ReportPeriodFilter
          from={from}
          onFromChange={setFrom}
          to={to}
          onToChange={setTo}
          onReset={handleResetFilters}
        />
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-[#1E293B] flex items-center gap-2 overflow-x-auto pb-1 print:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('sales')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'sales'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>المبيعات (Sales)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'products'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>حركة الأدوية (Products)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>المخزون والتقييم (Inventory)</span>
        </button>

        {isManagerOrAccountant && (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('purchases')}
              className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
                activeTab === 'purchases'
                  ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>المشتريات والموردين (Purchases)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('expenses')}
              className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
                activeTab === 'expenses'
                  ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>المصروفات (Expenses)</span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('customers')}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
            activeTab === 'customers'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>العملاء والولاء (Customers)</span>
        </button>

        {isManagerOrAccountant && (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('staff')}
              className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
                activeTab === 'staff'
                  ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>أداء الصيادلة (Staff & Commissions)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('financial-summary')}
              className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 shrink-0 cursor-pointer ${
                activeTab === 'financial-summary'
                  ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>الملخص المالي (Financial P&L)</span>
            </button>
          </>
        )}
      </div>

      {/* Active Tab View with Print Isolation Container */}
      <div id="report-print-container">
        {/* Printable Official Header */}
        <ReportPrintHeader
          reportTitle={
            activeTab === 'sales'
              ? 'تقرير المبيعات الشامل وتحليل الإيرادات'
              : activeTab === 'products'
              ? 'تقرير حركة وأداء الأصناف والأدوية'
              : activeTab === 'inventory'
              ? 'تقرير تقييم المخزون وصحة التشغيلات'
              : activeTab === 'purchases'
              ? 'تقرير المشتريات والتوريد وحجم الإنفاق'
              : activeTab === 'expenses'
              ? 'تقرير المصروفات التشغيلية والمصروفات الإدارية'
              : activeTab === 'customers'
              ? 'تقرير العملاء وسجل نقاط الولاء والشرائح'
              : activeTab === 'staff'
              ? 'تقرير إنتاجية الصيادلة ومستحقات العمولات'
              : 'تقرير الملخص المالي وقائمة الدخل (P&L)'
          }
          from={from}
          to={to}
        />

        {activeTab === 'sales' && salesQuery.data && (
          <SalesReportView data={salesQuery.data} isLoading={salesQuery.isLoading} />
        )}
        {activeTab === 'products' && productsQuery.data && (
          <ProductReportView data={productsQuery.data} isLoading={productsQuery.isLoading} />
        )}
        {activeTab === 'inventory' && inventoryQuery.data && (
          <InventoryReportView data={inventoryQuery.data} isLoading={inventoryQuery.isLoading} />
        )}
        {activeTab === 'purchases' && purchaseQuery.data && (
          <PurchaseReportView data={purchaseQuery.data} isLoading={purchaseQuery.isLoading} />
        )}
        {activeTab === 'expenses' && expenseQuery.data && (
          <ExpenseReportView data={expenseQuery.data} isLoading={expenseQuery.isLoading} />
        )}
        {activeTab === 'customers' && customerQuery.data && (
          <CustomerReportView data={customerQuery.data} isLoading={customerQuery.isLoading} />
        )}
        {activeTab === 'staff' && staffQuery.data && (
          <StaffReportView data={staffQuery.data} isLoading={staffQuery.isLoading} />
        )}
        {activeTab === 'financial-summary' && financialQuery.data && (
          <FinancialSummaryReportView data={financialQuery.data} isLoading={financialQuery.isLoading} />
        )}

        {/* Printable Official Footer */}
        <ReportPrintFooter />
      </div>

      {/* Print Report Selection Modal */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        initialReportType={activeTab}
        initialFrom={from}
        initialTo={to}
        onSelectAndPrint={handleSelectAndPrint}
      />
    </div>
  );
};
