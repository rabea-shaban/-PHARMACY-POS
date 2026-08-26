import { suppliersService } from './suppliers.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class SuppliersController {
    service;
    constructor(service = suppliersService) {
        this.service = service;
    }
    getSuppliers = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getSuppliers(filters);
            sendSuccess(res, 'Suppliers retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getSupplierById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const supplier = await this.service.getSupplierById(id);
            sendSuccess(res, 'Supplier retrieved successfully', supplier, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createSupplier = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const supplier = await this.service.createSupplier(req.body, actorId);
            sendSuccess(res, 'Supplier created successfully', supplier, 201);
        }
        catch (error) {
            next(error);
        }
    };
    updateSupplier = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const supplier = await this.service.updateSupplier(id, req.body, actorId);
            sendSuccess(res, 'Supplier updated successfully', supplier, 200);
        }
        catch (error) {
            next(error);
        }
    };
    deleteSupplier = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const supplier = await this.service.deleteSupplier(id, actorId);
            sendSuccess(res, 'Supplier deactivated successfully', supplier, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getSupplierPurchases = async (req, res, next) => {
        try {
            const supplierId = req.params.id;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const result = await this.service.getSupplierPurchases(supplierId, page, limit);
            sendSuccess(res, 'Supplier purchases retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const suppliersController = new SuppliersController();
//# sourceMappingURL=suppliers.controller.js.map