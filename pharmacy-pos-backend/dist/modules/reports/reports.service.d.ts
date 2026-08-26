import { ReportsRepository } from './reports.repository.js';
import { SalesReportQueryFilters, SalesReportResponse, ProductReportQueryFilters, ProductReportResponse, InventoryReportQueryFilters, InventoryReportResponse, PurchaseReportQueryFilters, PurchaseReportResponse, ExpenseReportQueryFilters, ExpenseReportResponse, CustomerReportQueryFilters, CustomerReportResponse, StaffReportQueryFilters, StaffReportResponse, FinancialSummaryResponse } from './reports.types.js';
export declare class ReportsService {
    private readonly repo;
    constructor(repo?: ReportsRepository);
    getSalesReport(filters: SalesReportQueryFilters): Promise<SalesReportResponse>;
    getProductPerformanceReport(filters: ProductReportQueryFilters): Promise<ProductReportResponse>;
    getInventoryReport(filters: InventoryReportQueryFilters): Promise<InventoryReportResponse>;
    getPurchaseReport(filters: PurchaseReportQueryFilters): Promise<PurchaseReportResponse>;
    getExpenseReport(filters: ExpenseReportQueryFilters): Promise<ExpenseReportResponse>;
    getCustomerReport(filters: CustomerReportQueryFilters): Promise<CustomerReportResponse>;
    getStaffReport(filters: StaffReportQueryFilters): Promise<StaffReportResponse>;
    getFinancialSummary(from?: string, to?: string): Promise<FinancialSummaryResponse>;
}
export declare const reportsService: ReportsService;
