import { Request, Response, NextFunction } from 'express';
import { SecurityService } from './security.service.js';
export declare class SecurityController {
    private readonly service;
    constructor(service?: SecurityService);
    getLoginLogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const securityController: SecurityController;
