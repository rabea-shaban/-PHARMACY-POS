import { Request, Response, NextFunction } from 'express';
import { suppliersService, SuppliersService } from './suppliers.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { SupplierQueryFilters } from './suppliers.types.js';

export class SuppliersController {
  constructor(private readonly service: SuppliersService = suppliersService) {}

  getSuppliers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as SupplierQueryFilters;
      const result = await this.service.getSuppliers(filters);
      sendSuccess(res, 'Suppliers retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getSupplierById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const supplier = await this.service.getSupplierById(id);
      sendSuccess(res, 'Supplier retrieved successfully', supplier, 200);
    } catch (error) {
      next(error);
    }
  };

  createSupplier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id;
      const supplier = await this.service.createSupplier(req.body, actorId);
      sendSuccess(res, 'Supplier created successfully', supplier, 201);
    } catch (error) {
      next(error);
    }
  };

  updateSupplier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const supplier = await this.service.updateSupplier(id, req.body, actorId);
      sendSuccess(res, 'Supplier updated successfully', supplier, 200);
    } catch (error) {
      next(error);
    }
  };

  deleteSupplier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const supplier = await this.service.deleteSupplier(id, actorId);
      sendSuccess(res, 'Supplier deactivated successfully', supplier, 200);
    } catch (error) {
      next(error);
    }
  };

  getSupplierPurchases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const supplierId = req.params.id as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await this.service.getSupplierPurchases(supplierId, page, limit);
      sendSuccess(res, 'Supplier purchases retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const suppliersController = new SuppliersController();
