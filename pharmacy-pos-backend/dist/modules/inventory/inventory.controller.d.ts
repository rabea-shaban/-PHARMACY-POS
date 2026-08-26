import { Request, Response, NextFunction } from 'express';
import { InventoryService } from './inventory.service.js';
export declare class InventoryController {
    private readonly service;
    constructor(service?: InventoryService);
    getTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProductTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBatchTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    adjustStock: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLowStockReport: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getExpiringReport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const inventoryController: InventoryController;
