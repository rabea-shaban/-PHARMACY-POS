import { batchesService } from './batches.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class BatchesController {
    service;
    constructor(service = batchesService) {
        this.service = service;
    }
    getBatches = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getBatches(filters);
            sendSuccess(res, 'Batches retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getBatchById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const batch = await this.service.getBatchById(id);
            sendSuccess(res, 'Batch retrieved successfully', batch, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getBatchesByProductId = async (req, res, next) => {
        try {
            const productId = req.params.productId;
            const batches = await this.service.getBatchesByProductId(productId);
            sendSuccess(res, 'Product batches retrieved successfully', batches, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getExpiringBatches = async (req, res, next) => {
        try {
            const days = Number(req.query.days) || 30;
            const batches = await this.service.getExpiringBatches(days);
            sendSuccess(res, 'Expiring batches retrieved successfully', batches, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getExpiredBatches = async (_req, res, next) => {
        try {
            const batches = await this.service.getExpiredBatches();
            sendSuccess(res, 'Expired batches retrieved successfully', batches, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createBatch = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const batch = await this.service.createBatch(req.body, actorId);
            sendSuccess(res, 'Batch created successfully', batch, 201);
        }
        catch (error) {
            next(error);
        }
    };
    updateBatch = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const batch = await this.service.updateBatch(id, req.body, actorId);
            sendSuccess(res, 'Batch updated successfully', batch, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const batchesController = new BatchesController();
//# sourceMappingURL=batches.controller.js.map