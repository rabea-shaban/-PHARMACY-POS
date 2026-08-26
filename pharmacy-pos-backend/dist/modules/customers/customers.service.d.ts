import { CustomersRepository } from './customers.repository.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateCustomerDTO, UpdateCustomerDTO } from './customers.validator.js';
import { CustomerProfileResponse, CustomerQueryFilters, PaginatedCustomersResponse, PaginatedCustomerPurchasesResponse } from './customers.types.js';
export declare class CustomersService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: CustomersRepository, audit?: AuditService);
    getCustomers(filters: CustomerQueryFilters): Promise<PaginatedCustomersResponse>;
    getCustomerById(id: string): Promise<CustomerProfileResponse>;
    createCustomer(input: CreateCustomerDTO, actorId?: string): Promise<CustomerProfileResponse>;
    updateCustomer(id: string, input: UpdateCustomerDTO, actorId?: string): Promise<CustomerProfileResponse>;
    deleteCustomer(id: string, actorId?: string): Promise<CustomerProfileResponse>;
    getCustomerPurchases(id: string, pageQuery: {
        page?: number;
        limit?: number;
    }): Promise<PaginatedCustomerPurchasesResponse>;
}
export declare const customersService: CustomersService;
