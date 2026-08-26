import { Request, Response, NextFunction } from 'express';
import { PurchasesService } from './purchases.service.js';
export declare class PurchasesController {
    private readonly service;
    constructor(service?: PurchasesService);
    getPurchases: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPurchaseById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createPurchase: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updatePurchase: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    receivePurchase: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    cancelPurchase: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const purchasesController: PurchasesController;
