import { Request, Response, NextFunction } from 'express';
import { batchesService, BatchesService } from './batches.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { BatchQueryFilters } from './batches.types.js';

export class BatchesController {
  constructor(private readonly service: BatchesService = batchesService) {}

  getBatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as BatchQueryFilters;
      const result = await this.service.getBatches(filters);
      sendSuccess(res, 'Batches retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getBatchById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const batch = await this.service.getBatchById(id);
      sendSuccess(res, 'Batch retrieved successfully', batch, 200);
    } catch (error) {
      next(error);
    }
  };

  getBatchesByProductId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.productId as string;
      const batches = await this.service.getBatchesByProductId(productId);
      sendSuccess(res, 'Product batches retrieved successfully', batches, 200);
    } catch (error) {
      next(error);
    }
  };

  getExpiringBatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const days = Number(req.query.days) || 30;
      const batches = await this.service.getExpiringBatches(days);
      sendSuccess(res, 'Expiring batches retrieved successfully', batches, 200);
    } catch (error) {
      next(error);
    }
  };

  getExpiredBatches = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const batches = await this.service.getExpiredBatches();
      sendSuccess(res, 'Expired batches retrieved successfully', batches, 200);
    } catch (error) {
      next(error);
    }
  };

  createBatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id;
      const batch = await this.service.createBatch(req.body, actorId);
      sendSuccess(res, 'Batch created successfully', batch, 201);
    } catch (error) {
      next(error);
    }
  };

  updateBatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const batch = await this.service.updateBatch(id, req.body, actorId);
      sendSuccess(res, 'Batch updated successfully', batch, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const batchesController = new BatchesController();
