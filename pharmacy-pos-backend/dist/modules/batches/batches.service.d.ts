import { BatchesRepository } from './batches.repository.js';
import { ProductsService } from '../products/products.service.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateBatchDTO, UpdateBatchDTO } from './batches.validator.js';
import { BatchResponse, BatchQueryFilters, PaginatedBatchesResponse } from './batches.types.js';
export declare class BatchesService {
    private readonly repo;
    private readonly products;
    private readonly audit;
    constructor(repo?: BatchesRepository, products?: ProductsService, audit?: AuditService);
    getBatches(filters: BatchQueryFilters): Promise<PaginatedBatchesResponse>;
    getBatchById(id: string): Promise<BatchResponse>;
    getBatchesByProductId(productId: string): Promise<BatchResponse[]>;
    createBatch(input: CreateBatchDTO, actorId?: string): Promise<BatchResponse>;
    updateBatch(id: string, input: UpdateBatchDTO, actorId?: string): Promise<BatchResponse>;
    getExpiringBatches(daysAhead?: number): Promise<BatchResponse[]>;
    getExpiredBatches(): Promise<BatchResponse[]>;
    getFEFOBatches(productId: string, requiredQuantity: number): Promise<{
        allocatedBatches: {
            batch: {
                product: {
                    name: string;
                    id: string;
                    category: {
                        name: string;
                        id: string;
                    };
                    barcode: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                quantity: number;
                expiryDate: Date;
                purchasePrice: import("@prisma/client-runtime-utils").Decimal;
                sellingPrice: import("@prisma/client-runtime-utils").Decimal;
                batchNumber: string;
            };
            allocatedQuantity: number;
        }[];
        fulfilled: boolean;
        shortfall: number;
    }>;
}
export declare const batchesService: BatchesService;
