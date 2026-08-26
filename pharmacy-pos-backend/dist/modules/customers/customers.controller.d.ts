import { Request, Response, NextFunction } from 'express';
import { CustomersService } from './customers.service.js';
export declare class CustomersController {
    private readonly service;
    constructor(service?: CustomersService);
    getCustomers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCustomerById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createCustomer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateCustomer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteCustomer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCustomerPurchases: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const customersController: CustomersController;
