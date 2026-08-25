import { Request, Response, NextFunction } from 'express';
import { loyaltyService, LoyaltyService } from './loyalty.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { LoyaltyTransactionQueryDTO } from './loyalty.validator.js';

export class LoyaltyController {
  constructor(private readonly service: LoyaltyService = loyaltyService) {}

  getLoyaltySummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = req.params.id as string;
      const summary = await this.service.getLoyaltySummary(customerId);
      sendSuccess(res, 'Loyalty summary retrieved successfully', summary, 200);
    } catch (error) {
      next(error);
    }
  };

  getLoyaltyTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = req.params.id as string;
      const filters = req.query as unknown as LoyaltyTransactionQueryDTO;
      const result = await this.service.getLoyaltyTransactions(customerId, filters);
      sendSuccess(res, 'Loyalty transactions retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  earnPoints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = req.params.id as string;
      const actorId = req.user?.id;
      const result = await this.service.earnPoints(customerId, req.body, actorId);
      sendSuccess(res, 'Loyalty points earned successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  redeemPoints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = req.params.id as string;
      const actorId = req.user?.id;
      const result = await this.service.redeemPoints(customerId, req.body, actorId);
      sendSuccess(res, 'Loyalty points redeemed successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  adjustPoints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = req.params.id as string;
      const actorId = req.user?.id;
      const actorRole = req.user?.role;
      const result = await this.service.adjustPoints(customerId, req.body, actorId, actorRole);
      sendSuccess(res, 'Loyalty points adjusted successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getCustomerTiers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tiers = await this.service.getCustomerTiers();
      sendSuccess(res, 'Customer tiers retrieved successfully', tiers, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const loyaltyController = new LoyaltyController();
