import { insuranceRepository, InsuranceRepository } from './insurance.repository.js';
import { customersService, CustomersService } from '../customers/customers.service.js';
import { auditService, AuditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import {
  CreateInsuranceProviderDTO,
  UpdateInsuranceProviderDTO,
  CreateCustomerInsuranceDTO,
} from './insurance.validator.js';
import {
  InsuranceProviderResponse,
  CustomerInsuranceResponse,
  InsuranceQueryFilters,
  PaginatedInsuranceProvidersResponse,
} from './insurance.types.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../utils/errors.js';

function formatProvider(raw: any): InsuranceProviderResponse {
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone,
    email: raw.email,
    address: raw.address,
    defaultCoveragePercentage: Number(raw.defaultCoveragePercentage),
    notes: raw.notes,
    isActive: raw.isActive,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function formatCustomerInsurance(raw: any): CustomerInsuranceResponse {
  return {
    id: raw.id,
    customerId: raw.customerId,
    insuranceProviderId: raw.insuranceProviderId,
    insuranceProvider: raw.insuranceProvider ? formatProvider(raw.insuranceProvider) : undefined,
    policyNumber: raw.policyNumber,
    memberNumber: raw.memberNumber,
    coveragePercentage: Number(raw.coveragePercentage),
    maxCoverageLimit: raw.maxCoverageLimit ? Number(raw.maxCoverageLimit) : null,
    expiryDate: raw.expiryDate,
    isActive: raw.isActive,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export class InsuranceService {
  constructor(
    private readonly repo: InsuranceRepository = insuranceRepository,
    private readonly customers: CustomersService = customersService,
    private readonly audit: AuditService = auditService
  ) {}

  async getProviders(filters: InsuranceQueryFilters): Promise<PaginatedInsuranceProvidersResponse> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const { items, total } = await this.repo.findManyProviders(filters);
    const pagination = getPaginationMeta(total, page, limit);

    return {
      items: items.map(formatProvider),
      pagination,
    };
  }

  async getProviderById(id: string): Promise<InsuranceProviderResponse> {
    const provider = await this.repo.findProviderById(id);
    if (!provider) {
      throw new NotFoundError(`Insurance provider with ID '${id}' not found`);
    }
    return formatProvider(provider);
  }

  async createProvider(input: CreateInsuranceProviderDTO, actorId?: string): Promise<InsuranceProviderResponse> {
    const name = input.name.trim();
    const existing = await this.repo.findProviderByName(name);
    if (existing) {
      throw new ConflictError(`Insurance provider with name '${name}' already exists`);
    }

    const created = await this.repo.createProvider({
      name,
      phone: input.phone ? input.phone.trim() : null,
      email: input.email ? input.email.trim() : null,
      address: input.address ? input.address.trim() : null,
      defaultCoveragePercentage: input.defaultCoveragePercentage,
      notes: input.notes ? input.notes.trim() : null,
    });

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'CREATE',
      entity: 'insurance_providers',
      entityId: created.id,
      newData: { name: created.name, defaultCoveragePercentage: input.defaultCoveragePercentage },
    });

    return formatProvider(created);
  }

  async updateProvider(id: string, input: UpdateInsuranceProviderDTO, actorId?: string): Promise<InsuranceProviderResponse> {
    const existing = await this.repo.findProviderById(id);
    if (!existing) {
      throw new NotFoundError(`Insurance provider with ID '${id}' not found`);
    }

    if (input.name && input.name.trim() !== existing.name) {
      const name = input.name.trim();
      const duplicate = await this.repo.findProviderByName(name);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictError(`Insurance provider with name '${name}' already exists`);
      }
    }

    const updateData: any = {};
    if (input.name) updateData.name = input.name.trim();
    if (input.phone !== undefined) updateData.phone = input.phone ? input.phone.trim() : null;
    if (input.email !== undefined) updateData.email = input.email ? input.email.trim() : null;
    if (input.address !== undefined) updateData.address = input.address ? input.address.trim() : null;
    if (input.defaultCoveragePercentage !== undefined) updateData.defaultCoveragePercentage = input.defaultCoveragePercentage;
    if (input.notes !== undefined) updateData.notes = input.notes ? input.notes.trim() : null;
    if (typeof input.isActive === 'boolean') updateData.isActive = input.isActive;

    const updated = await this.repo.updateProvider(id, updateData);

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'UPDATE',
      entity: 'insurance_providers',
      entityId: id,
      oldData: { name: existing.name, isActive: existing.isActive },
      newData: { name: updated.name, isActive: updated.isActive },
    });

    return formatProvider(updated);
  }

  async getCustomerInsurances(customerId: string): Promise<CustomerInsuranceResponse[]> {
    await this.customers.getCustomerById(customerId);
    const items = await this.repo.findCustomerInsurances(customerId);
    return items.map(formatCustomerInsurance);
  }

  async createCustomerInsurance(input: CreateCustomerInsuranceDTO, actorId?: string): Promise<CustomerInsuranceResponse> {
    await this.customers.getCustomerById(input.customerId);
    const provider = await this.getProviderById(input.insuranceProviderId);

    const coveragePercentage = input.coveragePercentage ?? Number(provider.defaultCoveragePercentage);

    const created = await this.repo.createCustomerInsurance({
      customerId: input.customerId,
      insuranceProviderId: input.insuranceProviderId,
      policyNumber: input.policyNumber.trim(),
      memberNumber: input.memberNumber.trim(),
      coveragePercentage,
      maxCoverageLimit: input.maxCoverageLimit,
      expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
    });

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'CREATE',
      entity: 'customer_insurances',
      entityId: created.id,
      newData: {
        customerId: input.customerId,
        provider: provider.name,
        policyNumber: created.policyNumber,
        coveragePercentage,
      },
    });

    return formatCustomerInsurance(created);
  }

  async validateAndCalculateInsurance(
    customerInsuranceId: string,
    customerId: string,
    grossAmount: number
  ): Promise<{
    insuranceProviderId: string;
    coveredAmount: number;
    customerAmount: number;
    coveragePercentage: number;
    claimReference: string;
  }> {
    const customerInsurance = await this.repo.findCustomerInsuranceById(customerInsuranceId);
    if (!customerInsurance) {
      throw new NotFoundError(`Customer insurance with ID '${customerInsuranceId}' not found`);
    }

    if (customerInsurance.customerId !== customerId) {
      throw new BadRequestError(`Customer insurance does not belong to customer ID '${customerId}'`);
    }

    if (!customerInsurance.isActive) {
      throw new BadRequestError(`Customer insurance policy '${customerInsurance.policyNumber}' is inactive`);
    }

    if (customerInsurance.expiryDate && new Date(customerInsurance.expiryDate) < new Date()) {
      throw new BadRequestError(`Customer insurance policy '${customerInsurance.policyNumber}' has expired`);
    }

    const coveragePercentage = Number(customerInsurance.coveragePercentage);
    let coveredAmount = (grossAmount * coveragePercentage) / 100;

    const maxLimit = customerInsurance.maxCoverageLimit ? Number(customerInsurance.maxCoverageLimit) : null;
    if (maxLimit !== null && coveredAmount > maxLimit) {
      coveredAmount = maxLimit;
    }

    coveredAmount = Math.min(coveredAmount, grossAmount);
    const customerAmount = Math.max(0, grossAmount - coveredAmount);

    return {
      insuranceProviderId: customerInsurance.insuranceProviderId,
      coveredAmount: Number(coveredAmount.toFixed(2)),
      customerAmount: Number(customerAmount.toFixed(2)),
      coveragePercentage,
      claimReference: `CLM-${customerInsurance.policyNumber}-${Date.now().toString().slice(-6)}`,
    };
  }
}

export const insuranceService = new InsuranceService();
