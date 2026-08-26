import { Request, Response } from 'express';
import { HealthService } from './health.service.js';
export declare class HealthController {
    private readonly service;
    constructor(service?: HealthService);
    getRootStatus: (_req: Request, res: Response) => void;
    getHealthStatus: (_req: Request, res: Response) => Promise<void>;
    testDatabaseOperations: (_req: Request, res: Response) => Promise<void>;
}
export declare const healthController: HealthController;
