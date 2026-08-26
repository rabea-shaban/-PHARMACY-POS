import { SuppliersRepository } from './suppliers.repository.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateSupplierDTO, UpdateSupplierDTO } from './suppliers.validator.js';
import { SupplierResponse, SupplierQueryFilters, PaginatedSuppliersResponse } from './suppliers.types.js';
export declare class SuppliersService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: SuppliersRepository, audit?: AuditService);
    getSuppliers(filters: SupplierQueryFilters): Promise<PaginatedSuppliersResponse>;
    getSupplierById(id: string): Promise<SupplierResponse>;
    createSupplier(input: CreateSupplierDTO, actorId?: string): Promise<SupplierResponse>;
    updateSupplier(id: string, input: UpdateSupplierDTO, actorId?: string): Promise<SupplierResponse>;
    deleteSupplier(id: string, actorId?: string): Promise<SupplierResponse>;
    getSupplierPurchases(supplierId: string, page?: number, limit?: number): Promise<{
        items: {
            id: string;
            supplierId: string;
            invoiceNumber: string;
            purchaseDate: Date;
            subtotal: number;
            discount: number;
            tax: number;
            total: number;
            paidAmount: number;
            remainingAmount: number;
            status: import("@prisma/client").$Enums.PurchaseStatus;
            itemCount: number;
            createdBy: {
                id: string;
                name: string;
            } | null;
            createdAt: Date;
        }[];
        pagination: import("../../types/common.types.js").PaginationMeta;
    }>;
}
export declare const suppliersService: SuppliersService;
