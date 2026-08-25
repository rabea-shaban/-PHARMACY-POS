import { Request, Response, NextFunction } from 'express';
import { paymentsService, PaymentsService } from './payments.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { PaymentQueryFilters } from './payments.types.js';

export class PaymentsController {
  constructor(private readonly service: PaymentsService = paymentsService) {}

  getPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as PaymentQueryFilters;
      const result = await this.service.getPayments(filters);
      sendSuccess(res, 'Payments retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const payment = await this.service.getPaymentById(id);
      sendSuccess(res, 'Payment retrieved successfully', payment, 200);
    } catch (error) {
      next(error);
    }
  };

  getPaymentsBySaleId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const saleId = req.params.saleId as string;
      const result = await this.service.getPaymentsBySaleId(saleId);
      sendSuccess(res, 'Sale payments retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const paymentsController = new PaymentsController();
