import { PurchasesRepository } from './purchases.repository.js';
import { SuppliersService } from '../suppliers/suppliers.service.js';
import { ProductsService } from '../products/products.service.js';
import { AuditService } from '../audit/audit.service.js';
import { CreatePurchaseDTO, UpdatePurchaseDTO, ReceivePurchaseDTO } from './purchases.validator.js';
import { PurchaseResponse, PurchaseQueryFilters, PaginatedPurchasesResponse } from './purchases.types.js';
export declare class PurchasesService {
    private readonly repo;
    private readonly suppliers;
    private readonly products;
    private readonly audit;
    constructor(repo?: PurchasesRepository, suppliers?: SuppliersService, products?: ProductsService, audit?: AuditService);
    getPurchases(filters: PurchaseQueryFilters): Promise<PaginatedPurchasesResponse>;
    getPurchaseById(id: string): Promise<PurchaseResponse>;
    createPurchase(input: CreatePurchaseDTO, actorId: string): Promise<PurchaseResponse>;
    updatePurchase(id: string, input: UpdatePurchaseDTO, actorId?: string): Promise<PurchaseResponse>;
    receivePurchase(id: string, input: ReceivePurchaseDTO, actorId?: string): Promise<PurchaseResponse>;
    cancelPurchase(id: string, reason?: string, actorId?: string): Promise<PurchaseResponse>;
}
export declare const purchasesService: PurchasesService;
