import { Request, Response, NextFunction } from 'express';
import { reportsService, ReportsService } from './reports.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import {
  SalesReportQueryFilters,
  ProductReportQueryFilters,
  InventoryReportQueryFilters,
  PurchaseReportQueryFilters,
  ExpenseReportQueryFilters,
  CustomerReportQueryFilters,
  StaffReportQueryFilters,
} from './reports.types.js';

export class ReportsController {
  constructor(private readonly service: ReportsService = reportsService) {}

  getSalesReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as SalesReportQueryFilters;
      const report = await this.service.getSalesReport(filters);
      sendSuccess(res, 'Sales report generated successfully', report, 200);
    } catch (error) {
      next(error);
    }
  };

  getProductReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as ProductReportQueryFilters;
      const report = await this.service.getProductPerformanceReport(filters);
      sendSuccess(res, 'Product performance report generated successfully', report, 200);
    } catch (error) {
      next(error);
    }
  };

  getInventoryReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as InventoryReportQueryFilters;
      const report = await this.service.getInventoryReport(filters);
      sendSuccess(res, 'Inventory report generated successfully', report, 200);
    } catch (error) {
      next(error);
    }
  };

  getPurchaseReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as PurchaseReportQueryFilters;
      const report = await this.service.getPurchaseReport(filters);
      sendSuccess(res, 'Purchases and suppliers report generated successfully', report, 200);
    } catch (error) {
      next(error);
    }
  };

  getExpenseReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as ExpenseReportQueryFilters;
      const report = await this.service.getExpenseReport(filters);
      sendSuccess(res, 'Expenses report generated successfully', report, 200);
    } catch (error) {
      next(error);
    }
  };

  getCustomerReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as CustomerReportQueryFilters;
      const report = await this.service.getCustomerReport(filters);
      sendSuccess(res, 'Customers and loyalty report generated successfully', report, 200);
    } catch (error) {
      next(error);
    }
  };

  getStaffReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as StaffReportQueryFilters;
      const report = await this.service.getStaffReport(filters);
      sendSuccess(res, 'Staff performance and commissions report generated successfully', report, 200);
    } catch (error) {
      next(error);
    }
  };

  getFinancialSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const from = req.query.from as string | undefined;
      const to = req.query.to as string | undefined;
      const report = await this.service.getFinancialSummary(from, to);
      sendSuccess(res, 'Financial summary report generated successfully', report, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const reportsController = new ReportsController();
