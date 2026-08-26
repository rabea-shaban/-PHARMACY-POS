import { Request, Response, NextFunction } from 'express';
import { AuditService } from './audit.service.js';
export declare class AuditController {
    private readonly service;
    constructor(service?: AuditService);
    getAuditLogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAuditLogById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getActivitySummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const auditController: AuditController;
