import { Request, Response, NextFunction } from 'express';
import { salesService, SalesService } from './sales.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { SaleQueryFilters } from './sales.types.js';

export class SalesController {
  constructor(private readonly service: SalesService = salesService) {}

  getSales = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as SaleQueryFilters;
      const result = await this.service.getSales(filters);
      sendSuccess(res, 'Sales retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getSaleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const sale = await this.service.getSaleById(id);
      sendSuccess(res, 'Sale retrieved successfully', sale, 200);
    } catch (error) {
      next(error);
    }
  };

  getSaleByInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const invoiceNumber = req.params.invoiceNumber as string;
      const sale = await this.service.getSaleByInvoiceNumber(invoiceNumber);
      sendSuccess(res, 'Sale retrieved by invoice number successfully', sale, 200);
    } catch (error) {
      next(error);
    }
  };

  checkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cashierId = req.user?.id as string;
      const sale = await this.service.checkout(req.body, cashierId);
      sendSuccess(res, 'Sale completed successfully', sale, 201);
    } catch (error) {
      next(error);
    }
  };

  cancelSale = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id as string;
      const sale = await this.service.cancelSale(id, actorId, req.body);
      sendSuccess(res, 'Sale cancelled successfully', sale, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const salesController = new SalesController();
