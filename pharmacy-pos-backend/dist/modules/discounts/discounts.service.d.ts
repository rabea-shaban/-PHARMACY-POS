import { DiscountsRepository } from './discounts.repository.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateDiscountDTO, UpdateDiscountDTO } from './discounts.validator.js';
import { DiscountResponse, DiscountQueryFilters, PaginatedDiscountsResponse } from './discounts.types.js';
export declare class DiscountsService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: DiscountsRepository, audit?: AuditService);
    getDiscounts(filters: DiscountQueryFilters): Promise<PaginatedDiscountsResponse>;
    getDiscountById(id: string): Promise<DiscountResponse>;
    getDiscountByCode(code: string): Promise<DiscountResponse>;
    validateAndCalculateDiscount(discountIdOrCode: string, subtotal: number): Promise<{
        discountId: string;
        discountAmount: number;
        discountReason: string;
    }>;
    createDiscount(input: CreateDiscountDTO, actorId?: string): Promise<DiscountResponse>;
    updateDiscount(id: string, input: UpdateDiscountDTO, actorId?: string): Promise<DiscountResponse>;
    deleteDiscount(id: string, actorId?: string): Promise<DiscountResponse>;
}
export declare const discountsService: DiscountsService;
