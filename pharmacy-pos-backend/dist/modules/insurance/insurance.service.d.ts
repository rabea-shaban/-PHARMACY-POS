import { InsuranceRepository } from './insurance.repository.js';
import { CustomersService } from '../customers/customers.service.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateInsuranceProviderDTO, UpdateInsuranceProviderDTO, CreateCustomerInsuranceDTO } from './insurance.validator.js';
import { InsuranceProviderResponse, CustomerInsuranceResponse, InsuranceQueryFilters, PaginatedInsuranceProvidersResponse } from './insurance.types.js';
export declare class InsuranceService {
    private readonly repo;
    private readonly customers;
    private readonly audit;
    constructor(repo?: InsuranceRepository, customers?: CustomersService, audit?: AuditService);
    getProviders(filters: InsuranceQueryFilters): Promise<PaginatedInsuranceProvidersResponse>;
    getProviderById(id: string): Promise<InsuranceProviderResponse>;
    createProvider(input: CreateInsuranceProviderDTO, actorId?: string): Promise<InsuranceProviderResponse>;
    updateProvider(id: string, input: UpdateInsuranceProviderDTO, actorId?: string): Promise<InsuranceProviderResponse>;
    getCustomerInsurances(customerId: string): Promise<CustomerInsuranceResponse[]>;
    createCustomerInsurance(input: CreateCustomerInsuranceDTO, actorId?: string): Promise<CustomerInsuranceResponse>;
    validateAndCalculateInsurance(customerInsuranceId: string, customerId: string, grossAmount: number): Promise<{
        insuranceProviderId: string;
        coveredAmount: number;
        customerAmount: number;
        coveragePercentage: number;
        claimReference: string;
    }>;
}
export declare const insuranceService: InsuranceService;
