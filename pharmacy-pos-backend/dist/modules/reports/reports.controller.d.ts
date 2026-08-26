import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './reports.service.js';
export declare class ReportsController {
    private readonly service;
    constructor(service?: ReportsService);
    getSalesReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProductReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getInventoryReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPurchaseReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getExpenseReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCustomerReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStaffReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getFinancialSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const reportsController: ReportsController;
