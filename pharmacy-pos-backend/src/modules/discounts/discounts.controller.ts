import { Request, Response, NextFunction } from 'express';
import { discountsService, DiscountsService } from './discounts.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { DiscountQueryFilters } from './discounts.types.js';

export class DiscountsController {
  constructor(private readonly service: DiscountsService = discountsService) {}

  getDiscounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as DiscountQueryFilters;
      const result = await this.service.getDiscounts(filters);
      sendSuccess(res, 'Discounts retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getDiscountById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const discount = await this.service.getDiscountById(id);
      sendSuccess(res, 'Discount retrieved successfully', discount, 200);
    } catch (error) {
      next(error);
    }
  };

  createDiscount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id;
      const discount = await this.service.createDiscount(req.body, actorId);
      sendSuccess(res, 'Discount created successfully', discount, 201);
    } catch (error) {
      next(error);
    }
  };

  updateDiscount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const discount = await this.service.updateDiscount(id, req.body, actorId);
      sendSuccess(res, 'Discount updated successfully', discount, 200);
    } catch (error) {
      next(error);
    }
  };

  deleteDiscount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const discount = await this.service.deleteDiscount(id, actorId);
      sendSuccess(res, 'Discount deactivated successfully', discount, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const discountsController = new DiscountsController();
