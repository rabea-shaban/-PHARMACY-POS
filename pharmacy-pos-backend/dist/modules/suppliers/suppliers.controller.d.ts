import { Request, Response, NextFunction } from 'express';
import { SuppliersService } from './suppliers.service.js';
export declare class SuppliersController {
    private readonly service;
    constructor(service?: SuppliersService);
    getSuppliers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSupplierById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createSupplier: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateSupplier: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteSupplier: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSupplierPurchases: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const suppliersController: SuppliersController;
