import { Request, Response, NextFunction } from 'express';
import { productsService, ProductsService } from './products.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { ProductQueryFilters, ProductSearchQueryFilters } from './products.types.js';

export class ProductsController {
  constructor(private readonly service: ProductsService = productsService) {}

  getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as ProductQueryFilters;
      const result = await this.service.getProducts(filters);
      sendSuccess(res, 'Products retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as ProductSearchQueryFilters;
      const items = await this.service.searchProducts(filters);
      sendSuccess(res, 'Products search completed successfully', items, 200);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const product = await this.service.getProductById(id);
      sendSuccess(res, 'Product retrieved successfully', product, 200);
    } catch (error) {
      next(error);
    }
  };

  getProductByBarcode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const barcode = req.params.barcode as string;
      const product = await this.service.getProductByBarcode(barcode);
      sendSuccess(res, 'Product retrieved by barcode successfully', product, 200);
    } catch (error) {
      next(error);
    }
  };

  getProductStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const days = Number(req.query.days) || 30;
      const stockSummary = await this.service.getProductStockSummary(id, days);
      sendSuccess(res, 'Product stock summary retrieved successfully', stockSummary, 200);
    } catch (error) {
      next(error);
    }
  };

  getLowStockProducts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getLowStockProducts();
      sendSuccess(res, 'Low stock products retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getExpiringProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const days = Number(req.query.days) || 30;
      const result = await this.service.getExpiringProducts(days);
      sendSuccess(res, 'Expiring products retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id;
      const product = await this.service.createProduct(req.body, actorId);
      sendSuccess(res, 'Product created successfully', product, 201);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const product = await this.service.updateProduct(id, req.body, actorId);
      sendSuccess(res, 'Product updated successfully', product, 200);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const product = await this.service.deleteProduct(id, actorId);
      sendSuccess(res, 'Product deactivated successfully', product, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const productsController = new ProductsController();
