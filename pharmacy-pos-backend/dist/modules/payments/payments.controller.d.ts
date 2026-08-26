import { Request, Response, NextFunction } from 'express';
import { PaymentsService } from './payments.service.js';
export declare class PaymentsController {
    private readonly service;
    constructor(service?: PaymentsService);
    getPayments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPaymentById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPaymentsBySaleId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const paymentsController: PaymentsController;
