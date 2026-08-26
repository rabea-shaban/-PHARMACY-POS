import { Request, Response, NextFunction } from 'express';
import { SalesService } from './sales.service.js';
export declare class SalesController {
    private readonly service;
    constructor(service?: SalesService);
    getSales: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSaleById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSaleByInvoice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    checkout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    cancelSale: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const salesController: SalesController;
