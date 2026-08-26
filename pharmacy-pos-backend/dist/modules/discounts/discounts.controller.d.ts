import { Request, Response, NextFunction } from 'express';
import { DiscountsService } from './discounts.service.js';
export declare class DiscountsController {
    private readonly service;
    constructor(service?: DiscountsService);
    getDiscounts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDiscountById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createDiscount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateDiscount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteDiscount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const discountsController: DiscountsController;
