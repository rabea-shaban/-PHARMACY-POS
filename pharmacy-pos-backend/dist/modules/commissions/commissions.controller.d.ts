import { Request, Response, NextFunction } from 'express';
import { CommissionsService } from './commissions.service.js';
export declare class CommissionsController {
    private readonly service;
    constructor(service?: CommissionsService);
    getRules: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    createRule: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateRule: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStaffTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const commissionsController: CommissionsController;
