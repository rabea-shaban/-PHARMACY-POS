import { Request, Response, NextFunction } from 'express';
import { purchasesService, PurchasesService } from './purchases.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { PurchaseQueryFilters } from './purchases.types.js';

export class PurchasesController {
  constructor(private readonly service: PurchasesService = purchasesService) {}

  getPurchases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as PurchaseQueryFilters;
      const result = await this.service.getPurchases(filters);
      sendSuccess(res, 'Purchases retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getPurchaseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const purchase = await this.service.getPurchaseById(id);
      sendSuccess(res, 'Purchase retrieved successfully', purchase, 200);
    } catch (error) {
      next(error);
    }
  };

  createPurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id as string;
      const purchase = await this.service.createPurchase(req.body, actorId);
      sendSuccess(res, 'Purchase invoice created successfully', purchase, 201);
    } catch (error) {
      next(error);
    }
  };

  updatePurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const purchase = await this.service.updatePurchase(id, req.body, actorId);
      sendSuccess(res, 'Purchase invoice updated successfully', purchase, 200);
    } catch (error) {
      next(error);
    }
  };

  receivePurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const purchase = await this.service.receivePurchase(id, req.body, actorId);
      sendSuccess(res, 'Purchase received and inventory updated successfully', purchase, 200);
    } catch (error) {
      next(error);
    }
  };

  cancelPurchase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const reason = req.body?.reason;
      const purchase = await this.service.cancelPurchase(id, reason, actorId);
      sendSuccess(res, 'Purchase cancelled successfully', purchase, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const purchasesController = new PurchasesController();
