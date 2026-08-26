import { Request, Response, NextFunction } from 'express';
import { LoyaltyService } from './loyalty.service.js';
export declare class LoyaltyController {
    private readonly service;
    constructor(service?: LoyaltyService);
    getLoyaltySummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLoyaltyTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    earnPoints: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    redeemPoints: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    adjustPoints: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCustomerTiers: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const loyaltyController: LoyaltyController;
