import { Role } from '@prisma/client';
import { InventoryRepository } from './inventory.repository.js';
import { ProductsService } from '../products/products.service.js';
import { AuditService } from '../audit/audit.service.js';
import { StockAdjustmentDTO, InventoryTransactionQueryDTO } from './inventory.validator.js';
import { PaginatedInventoryTransactionsResponse } from './inventory.types.js';
export declare class InventoryService {
    private readonly repo;
    private readonly products;
    private readonly audit;
    constructor(repo?: InventoryRepository, products?: ProductsService, audit?: AuditService);
    getTransactions(filters: InventoryTransactionQueryDTO): Promise<PaginatedInventoryTransactionsResponse>;
    getProductTransactions(productId: string, page?: number, limit?: number): Promise<PaginatedInventoryTransactionsResponse>;
    getBatchTransactions(batchId: string, page?: number, limit?: number): Promise<PaginatedInventoryTransactionsResponse>;
    adjustStock(input: StockAdjustmentDTO, actorId?: string, actorRole?: Role): Promise<{
        transactionId: string;
        productId: string;
        batchId: string;
        quantityChanged: number;
        newBatchQuantity: number;
        type: "SALE" | "PURCHASE" | "SALE_RETURN" | "PURCHASE_RETURN" | "ADJUSTMENT" | "DAMAGE" | "EXPIRED" | "MANUAL_IN" | "MANUAL_OUT";
        reason: string;
        createdAt: Date;
    }>;
    getLowStockReport(): Promise<import("../products/products.types.js").LowStockProductItem[]>;
    getExpiringReport(daysAhead?: number): Promise<import("../products/products.types.js").ExpiringProductItem[]>;
}
export declare const inventoryService: InventoryService;
