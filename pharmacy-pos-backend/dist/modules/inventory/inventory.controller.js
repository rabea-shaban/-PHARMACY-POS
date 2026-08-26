import { inventoryService } from './inventory.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class InventoryController {
    service;
    constructor(service = inventoryService) {
        this.service = service;
    }
    getTransactions = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getTransactions(filters);
            sendSuccess(res, 'Inventory transactions retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getProductTransactions = async (req, res, next) => {
        try {
            const productId = req.params.productId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const result = await this.service.getProductTransactions(productId, page, limit);
            sendSuccess(res, 'Product inventory transactions retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getBatchTransactions = async (req, res, next) => {
        try {
            const batchId = req.params.batchId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const result = await this.service.getBatchTransactions(batchId, page, limit);
            sendSuccess(res, 'Batch inventory transactions retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    adjustStock = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const actorRole = req.user?.role;
            const result = await this.service.adjustStock(req.body, actorId, actorRole);
            sendSuccess(res, 'Stock adjustment completed successfully', result, 201);
        }
        catch (error) {
            next(error);
        }
    };
    getLowStockReport = async (_req, res, next) => {
        try {
            const report = await this.service.getLowStockReport();
            sendSuccess(res, 'Low stock inventory report retrieved successfully', report, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getExpiringReport = async (req, res, next) => {
        try {
            const days = Number(req.query.days) || 30;
            const report = await this.service.getExpiringReport(days);
            sendSuccess(res, 'Expiring inventory report retrieved successfully', report, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const inventoryController = new InventoryController();
//# sourceMappingURL=inventory.controller.js.map