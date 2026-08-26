import { Request, Response, NextFunction } from 'express';
import { InsuranceService } from './insurance.service.js';
export declare class InsuranceController {
    private readonly service;
    constructor(service?: InsuranceService);
    getProviders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProviderById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createProvider: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProvider: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCustomerInsurances: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createCustomerInsurance: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const insuranceController: InsuranceController;
