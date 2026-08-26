import { Request, Response, NextFunction } from 'express';
import { BatchesService } from './batches.service.js';
export declare class BatchesController {
    private readonly service;
    constructor(service?: BatchesService);
    getBatches: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBatchById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBatchesByProductId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getExpiringBatches: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getExpiredBatches: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    createBatch: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateBatch: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const batchesController: BatchesController;
