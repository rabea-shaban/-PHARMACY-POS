import { Role } from '@prisma/client';
import { InventoryRepository } from './inventory.repository.js';
import { ProductsService } from '../products/products.service.js';
import { AuditService } from '../audit/audit.service.js';
import { StockAdjustmentDTO, InventoryTransactionQueryDTO, InventoryMatrixQueryDTO } from './inventory.validator.js';
import { PaginatedInventoryTransactionsResponse } from './inventory.types.js';
export declare class InventoryService {
    private readonly repo;
    private readonly products;
    private readonly audit;
    constructor(repo?: InventoryRepository, products?: ProductsService, audit?: AuditService);
    getTransactions(filters: InventoryTransactionQueryDTO): Promise<PaginatedInventoryTransactionsResponse>;
    getInventoryMatrix(query: InventoryMatrixQueryDTO): Promise<{
        branches: {
            name: string;
            id: string;
            code: string;
            isMain: boolean;
        }[];
        items: {
            id: string;
            name: string;
            barcode: string | null;
            scientificName: string | null;
            category: {
                name: string;
                id: string;
            };
            sellingPrice: number;
            minimumStock: number;
            totalStock: number;
            isLowStock: boolean;
            branchStock: {
                branchId: string;
                branchName: string;
                branchCode: string;
                isMain: boolean;
                stock: number;
                batchesCount: number;
                nearestExpiry: Date | null;
            }[];
        }[];
        pagination: import("../../types/common.types.js").PaginationMeta;
    }>;
    getProductTransactions(productId: string, page?: number, limit?: number): Promise<PaginatedInventoryTransactionsResponse>;
    getBatchTransactions(batchId: string, page?: number, limit?: number): Promise<PaginatedInventoryTransactionsResponse>;
    adjustStock(input: StockAdjustmentDTO, actorId?: string, actorRole?: Role): Promise<{
        transactionId: string;
        productId: string;
        batchId: string;
        quantityChanged: number;
        newBatchQuantity: number;
        type: "SALE" | "PURCHASE" | "SALE_RETURN" | "PURCHASE_RETURN" | "ADJUSTMENT" | "DAMAGE" | "EXPIRED" | "MANUAL_IN" | "MANUAL_OUT" | "TRANSFER_OUT" | "TRANSFER_IN";
        reason: string;
        createdAt: Date;
    }>;
    getLowStockReport(): Promise<import("../products/products.types.js").LowStockProductItem[]>;
    getExpiringReport(daysAhead?: number): Promise<import("../products/products.types.js").ExpiringProductItem[]>;
}
export declare const inventoryService: InventoryService;
