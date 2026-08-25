import { Request, Response, NextFunction } from 'express';
import { payrollService, PayrollService } from './payroll.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { PayrollQueryDTO } from './payroll.validator.js';

export class PayrollController {
  constructor(private readonly service: PayrollService = payrollService) {}

  generatePayroll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id as string;
      const result = await this.service.generatePayroll(req.body, actorId);
      sendSuccess(res, 'Payroll calculated and generated successfully', result, 201);
    } catch (error) {
      next(error);
    }
  };

  generatePeriodPayroll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id as string;
      const result = await this.service.generatePeriodPayroll(req.body, actorId);
      sendSuccess(res, `Generated ${result.length} payroll records for the period`, result, 201);
    } catch (error) {
      next(error);
    }
  };

  getPayrolls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as PayrollQueryDTO;
      const result = await this.service.getPayrolls(filters);
      sendSuccess(res, 'Payrolls retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getPayrollById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.service.getPayrollById(id);
      sendSuccess(res, 'Payroll details retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getEmployeePayrolls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId = req.params.employeeId as string;
      const result = await this.service.getEmployeePayrolls(employeeId);
      sendSuccess(res, 'Employee payroll history retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  updatePayroll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id as string;
      const result = await this.service.updatePayroll(id, req.body, actorId);
      sendSuccess(res, 'Payroll record updated successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  approvePayroll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id as string;
      const result = await this.service.approvePayroll(id, actorId);
      sendSuccess(res, 'Payroll approved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  payPayroll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id as string;
      const result = await this.service.payPayroll(id, req.body, actorId);
      sendSuccess(res, 'Payroll settlement completed successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  cancelPayroll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id as string;
      const result = await this.service.cancelPayroll(id, actorId);
      sendSuccess(res, 'Payroll record cancelled successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const from = req.query.from as string | undefined;
      const to = req.query.to as string | undefined;
      const result = await this.service.getSummary(from, to);
      sendSuccess(res, 'Payroll summary retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const payrollController = new PayrollController();
