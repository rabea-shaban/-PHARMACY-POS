import { Request, Response, NextFunction } from 'express';
import { SaleReturnsService } from './sale-returns.service.js';
export declare class SaleReturnsController {
    private readonly service;
    constructor(service?: SaleReturnsService);
    getSaleReturns: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSaleReturnById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getReturnsBySaleId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createSaleReturn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const saleReturnsController: SaleReturnsController;
