import { Request, Response, NextFunction } from 'express';
import { PayrollService } from './payroll.service.js';
export declare class PayrollController {
    private readonly service;
    constructor(service?: PayrollService);
    generatePayroll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    generatePeriodPayroll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPayrolls: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPayrollById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getEmployeePayrolls: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updatePayroll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    approvePayroll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    payPayroll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    cancelPayroll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const payrollController: PayrollController;
