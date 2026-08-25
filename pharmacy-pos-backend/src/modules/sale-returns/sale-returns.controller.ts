import { Request, Response, NextFunction } from 'express';
import { saleReturnsService, SaleReturnsService } from './sale-returns.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { SaleReturnQueryFilters } from './sale-returns.types.js';

export class SaleReturnsController {
  constructor(private readonly service: SaleReturnsService = saleReturnsService) {}

  getSaleReturns = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as SaleReturnQueryFilters;
      const result = await this.service.getSaleReturns(filters);
      sendSuccess(res, 'Sale returns retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getSaleReturnById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.service.getSaleReturnById(id);
      sendSuccess(res, 'Sale return retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getReturnsBySaleId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const saleId = req.params.saleId as string;
      const result = await this.service.getReturnsBySaleId(saleId);
      sendSuccess(res, 'Returns for sale retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  createSaleReturn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const processedById = req.user?.id as string;
      const result = await this.service.createSaleReturn(req.body, processedById);
      sendSuccess(res, 'Sale return processed successfully', result, 201);
    } catch (error) {
      next(error);
    }
  };
}

export const saleReturnsController = new SaleReturnsController();
