import { SaleReturnsRepository } from './sale-returns.repository.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateSaleReturnDTO } from './sale-returns.validator.js';
import { SaleReturnResponse, SaleReturnQueryFilters, PaginatedSaleReturnsResponse } from './sale-returns.types.js';
export declare class SaleReturnsService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: SaleReturnsRepository, audit?: AuditService);
    getSaleReturns(filters: SaleReturnQueryFilters): Promise<PaginatedSaleReturnsResponse>;
    getSaleReturnById(id: string): Promise<SaleReturnResponse>;
    getReturnsBySaleId(saleId: string): Promise<SaleReturnResponse[]>;
    createSaleReturn(input: CreateSaleReturnDTO, processedById: string): Promise<SaleReturnResponse>;
}
export declare const saleReturnsService: SaleReturnsService;
