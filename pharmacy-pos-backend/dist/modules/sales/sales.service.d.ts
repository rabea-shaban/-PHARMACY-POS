import { SalesRepository } from './sales.repository.js';
import { ProductsService } from '../products/products.service.js';
import { BatchesService } from '../batches/batches.service.js';
import { CustomersService } from '../customers/customers.service.js';
import { DiscountsService } from '../discounts/discounts.service.js';
import { InsuranceService } from '../insurance/insurance.service.js';
import { CommissionsService } from '../commissions/commissions.service.js';
import { CheckoutRequestDTO, CancelSaleDTO } from './sales.validator.js';
import { SaleResponse, SaleQueryFilters, PaginatedSalesResponse } from './sales.types.js';
export declare class SalesService {
    private readonly repo;
    private readonly products;
    private readonly batches;
    private readonly customers;
    private readonly discounts;
    private readonly insurance;
    private readonly commissions;
    constructor(repo?: SalesRepository, products?: ProductsService, batches?: BatchesService, customers?: CustomersService, discounts?: DiscountsService, insurance?: InsuranceService, commissions?: CommissionsService);
    getSales(filters: SaleQueryFilters): Promise<PaginatedSalesResponse>;
    getSaleById(id: string): Promise<SaleResponse>;
    getSaleByInvoiceNumber(invoiceNumber: string): Promise<SaleResponse>;
    checkout(input: CheckoutRequestDTO, cashierId: string): Promise<SaleResponse>;
    cancelSale(id: string, actorId: string, input: CancelSaleDTO): Promise<SaleResponse>;
}
export declare const salesService: SalesService;
