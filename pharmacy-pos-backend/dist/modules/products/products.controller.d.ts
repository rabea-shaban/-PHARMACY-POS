import { Request, Response, NextFunction } from 'express';
import { ProductsService } from './products.service.js';
export declare class ProductsController {
    private readonly service;
    constructor(service?: ProductsService);
    getProducts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    searchProducts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProductById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProductByBarcode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProductStock: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLowStockProducts: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getExpiringProducts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const productsController: ProductsController;
