import { Request, Response, NextFunction } from 'express';
import { commissionsService, CommissionsService } from './commissions.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { CommissionTransactionQueryFilters } from './commissions.types.js';

export class CommissionsController {
  constructor(private readonly service: CommissionsService = commissionsService) {}

  getRules = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rules = await this.service.getRules();
      sendSuccess(res, 'Commission rules retrieved successfully', rules, 200);
    } catch (error) {
      next(error);
    }
  };

  createRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id;
      const rule = await this.service.createRule(req.body, actorId);
      sendSuccess(res, 'Commission rule created successfully', rule, 201);
    } catch (error) {
      next(error);
    }
  };

  updateRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const rule = await this.service.updateRule(id, req.body, actorId);
      sendSuccess(res, 'Commission rule updated successfully', rule, 200);
    } catch (error) {
      next(error);
    }
  };

  getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as CommissionTransactionQueryFilters;
      const result = await this.service.getTransactions(filters);
      sendSuccess(res, 'Commission transactions retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getStaffTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId as string;
      const filters = req.query as unknown as CommissionTransactionQueryFilters;
      const result = await this.service.getStaffTransactions(userId, filters);
      sendSuccess(res, 'Staff commission transactions retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const summary = await this.service.getSummary(startDate, endDate);
      sendSuccess(res, 'Commission summary retrieved successfully', summary, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const commissionsController = new CommissionsController();
