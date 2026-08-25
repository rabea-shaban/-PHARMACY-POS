import { discountsRepository, DiscountsRepository } from './discounts.repository.js';
import { auditService, AuditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { CreateDiscountDTO, UpdateDiscountDTO } from './discounts.validator.js';
import {
  DiscountResponse,
  DiscountQueryFilters,
  PaginatedDiscountsResponse,
} from './discounts.types.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../utils/errors.js';

function formatDiscount(raw: any): DiscountResponse {
  return {
    id: raw.id,
    code: raw.code,
    name: raw.name,
    type: raw.type,
    value: Number(raw.value),
    minimumPurchase: Number(raw.minimumPurchase),
    startDate: raw.startDate,
    endDate: raw.endDate,
    isActive: raw.isActive,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export class DiscountsService {
  constructor(
    private readonly repo: DiscountsRepository = discountsRepository,
    private readonly audit: AuditService = auditService
  ) {}

  async getDiscounts(filters: DiscountQueryFilters): Promise<PaginatedDiscountsResponse> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const { items, total } = await this.repo.findMany(filters);
    const pagination = getPaginationMeta(total, page, limit);

    return {
      items: items.map(formatDiscount),
      pagination,
    };
  }

  async getDiscountById(id: string): Promise<DiscountResponse> {
    const discount = await this.repo.findById(id);
    if (!discount) {
      throw new NotFoundError(`Discount with ID '${id}' not found`);
    }
    return formatDiscount(discount);
  }

  async getDiscountByCode(code: string): Promise<DiscountResponse> {
    const discount = await this.repo.findByCode(code.trim().toUpperCase());
    if (!discount) {
      throw new NotFoundError(`Discount with code '${code}' not found`);
    }
    return formatDiscount(discount);
  }

  async validateAndCalculateDiscount(
    discountIdOrCode: string,
    subtotal: number
  ): Promise<{ discountId: string; discountAmount: number; discountReason: string }> {
    let discount = await this.repo.findById(discountIdOrCode);
    if (!discount) {
      discount = await this.repo.findByCode(discountIdOrCode.trim().toUpperCase());
    }

    if (!discount) {
      throw new NotFoundError(`Discount '${discountIdOrCode}' not found`);
    }

    if (!discount.isActive) {
      throw new BadRequestError(`Discount '${discount.name}' is inactive`);
    }

    const now = new Date();
    if (discount.startDate && new Date(discount.startDate) > now) {
      throw new BadRequestError(`Discount '${discount.name}' is not yet effective`);
    }
    if (discount.endDate && new Date(discount.endDate) < now) {
      throw new BadRequestError(`Discount '${discount.name}' has expired`);
    }

    const minPurchase = Number(discount.minimumPurchase);
    if (minPurchase > 0 && subtotal < minPurchase) {
      throw new BadRequestError(
        `Minimum purchase amount of ${minPurchase} EGP required for discount '${discount.name}' (current subtotal: ${subtotal} EGP)`
      );
    }

    let discountAmount = 0;
    const discountValue = Number(discount.value);

    if (discount.type === 'PERCENTAGE' || discount.type === 'PROMOTIONAL' || discount.type === 'CUSTOMER_TIER') {
      discountAmount = (subtotal * discountValue) / 100;
    } else {
      discountAmount = discountValue;
    }

    // Guard against discounting more than subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    return {
      discountId: discount.id,
      discountAmount: Number(discountAmount.toFixed(2)),
      discountReason: discount.name,
    };
  }

  async createDiscount(input: CreateDiscountDTO, actorId?: string): Promise<DiscountResponse> {
    if (input.code) {
      const code = input.code.trim().toUpperCase();
      const existing = await this.repo.findByCode(code);
      if (existing) {
        throw new ConflictError(`Discount with code '${code}' already exists`);
      }
    }

    const created = await this.repo.create({
      code: input.code ? input.code.trim().toUpperCase() : null,
      name: input.name.trim(),
      type: input.type,
      value: input.value,
      minimumPurchase: input.minimumPurchase,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
    });

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'CREATE',
      entity: 'discounts',
      entityId: created.id,
      newData: { name: created.name, type: created.type, value: input.value },
    });

    return formatDiscount(created);
  }

  async updateDiscount(id: string, input: UpdateDiscountDTO, actorId?: string): Promise<DiscountResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Discount with ID '${id}' not found`);
    }

    if (input.code && input.code.trim().toUpperCase() !== existing.code) {
      const code = input.code.trim().toUpperCase();
      const duplicate = await this.repo.findByCode(code);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictError(`Discount with code '${code}' already exists`);
      }
    }

    const updateData: {
      code?: string | null;
      name?: string;
      type?: any;
      value?: number;
      minimumPurchase?: number;
      startDate?: Date | null;
      endDate?: Date | null;
      isActive?: boolean;
    } = {};

    if (input.code !== undefined) updateData.code = input.code ? input.code.trim().toUpperCase() : null;
    if (input.name) updateData.name = input.name.trim();
    if (input.type) updateData.type = input.type;
    if (input.value !== undefined) updateData.value = input.value;
    if (input.minimumPurchase !== undefined) updateData.minimumPurchase = input.minimumPurchase;
    if (input.startDate !== undefined) updateData.startDate = input.startDate ? new Date(input.startDate) : null;
    if (input.endDate !== undefined) updateData.endDate = input.endDate ? new Date(input.endDate) : null;
    if (typeof input.isActive === 'boolean') updateData.isActive = input.isActive;

    const updated = await this.repo.update(id, updateData);

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'UPDATE',
      entity: 'discounts',
      entityId: id,
      oldData: { name: existing.name, isActive: existing.isActive },
      newData: { name: updated.name, isActive: updated.isActive },
    });

    return formatDiscount(updated);
  }

  async deleteDiscount(id: string, actorId?: string): Promise<DiscountResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Discount with ID '${id}' not found`);
    }

    const deactivated = await this.repo.softDelete(id);

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'DELETE',
      entity: 'discounts',
      entityId: id,
      metadata: { reason: 'Soft deactivation of discount' },
    });

    return formatDiscount(deactivated);
  }
}

export const discountsService = new DiscountsService();
