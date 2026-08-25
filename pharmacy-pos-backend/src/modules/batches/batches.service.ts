import { batchesRepository, BatchesRepository } from './batches.repository.js';
import { productsService, ProductsService } from '../products/products.service.js';
import { auditService, AuditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { CreateBatchDTO, UpdateBatchDTO } from './batches.validator.js';
import {
  BatchResponse,
  BatchQueryFilters,
  PaginatedBatchesResponse,
} from './batches.types.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';

function formatBatch(raw: any): BatchResponse {
  const now = new Date().getTime();
  const expiryTime = new Date(raw.expiryDate).getTime();
  const isExpired = expiryTime < now;
  const daysToExpiry = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

  return {
    id: raw.id,
    productId: raw.productId,
    product: raw.product
      ? {
          id: raw.product.id,
          name: raw.product.name,
          barcode: raw.product.barcode,
          category: raw.product.category
            ? {
                id: raw.product.category.id,
                name: raw.product.category.name,
              }
            : undefined,
        }
      : undefined,
    batchNumber: raw.batchNumber,
    expiryDate: raw.expiryDate,
    quantity: raw.quantity,
    purchasePrice: Number(raw.purchasePrice),
    sellingPrice: Number(raw.sellingPrice),
    isExpired,
    daysToExpiry,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export class BatchesService {
  constructor(
    private readonly repo: BatchesRepository = batchesRepository,
    private readonly products: ProductsService = productsService,
    private readonly audit: AuditService = auditService
  ) {}

  async getBatches(filters: BatchQueryFilters): Promise<PaginatedBatchesResponse> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const { items, total } = await this.repo.findMany(filters);
    const pagination = getPaginationMeta(total, page, limit);

    return {
      items: items.map(formatBatch),
      pagination,
    };
  }

  async getBatchById(id: string): Promise<BatchResponse> {
    const batch = await this.repo.findById(id);
    if (!batch) {
      throw new NotFoundError(`Batch with ID '${id}' not found`);
    }
    return formatBatch(batch);
  }

  async getBatchesByProductId(productId: string): Promise<BatchResponse[]> {
    await this.products.getProductById(productId);
    const batches = await this.repo.findByProductId(productId);
    return batches.map(formatBatch);
  }

  async createBatch(input: CreateBatchDTO, actorId?: string): Promise<BatchResponse> {
    const batchNumber = input.batchNumber.trim();

    // 1. Verify product exists
    const product = await this.products.getProductById(input.productId);

    // 2. Duplicate batch check for this product
    const existing = await this.repo.findByProductAndBatchNumber(input.productId, batchNumber);
    if (existing) {
      throw new ConflictError(
        `Batch '${batchNumber}' already exists for product '${product.name}'`
      );
    }

    const expiryDate = new Date(input.expiryDate);

    const created = await this.repo.create({
      productId: input.productId,
      batchNumber,
      expiryDate,
      quantity: input.quantity ?? 0,
      purchasePrice: input.purchasePrice,
      sellingPrice: input.sellingPrice,
      actorId,
    });

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'CREATE',
      entity: 'batches',
      entityId: created.id,
      newData: {
        productId: input.productId,
        batchNumber,
        quantity: input.quantity,
        expiryDate,
      },
    });

    return formatBatch(created);
  }

  async updateBatch(id: string, input: UpdateBatchDTO, actorId?: string): Promise<BatchResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Batch with ID '${id}' not found`);
    }

    const updateData: {
      expiryDate?: Date;
      purchasePrice?: number;
      sellingPrice?: number;
    } = {};

    if (input.expiryDate) updateData.expiryDate = new Date(input.expiryDate);
    if (input.purchasePrice !== undefined) updateData.purchasePrice = input.purchasePrice;
    if (input.sellingPrice !== undefined) updateData.sellingPrice = input.sellingPrice;

    const updated = await this.repo.update(id, updateData);

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'UPDATE',
      entity: 'batches',
      entityId: id,
      oldData: { expiryDate: existing.expiryDate, sellingPrice: existing.sellingPrice },
      newData: { expiryDate: updated.expiryDate, sellingPrice: updated.sellingPrice },
    });

    return formatBatch(updated);
  }

  async getExpiringBatches(daysAhead = 30): Promise<BatchResponse[]> {
    const batches = await this.repo.findExpiring(daysAhead);
    return batches.map(formatBatch);
  }

  async getExpiredBatches(): Promise<BatchResponse[]> {
    const batches = await this.repo.findExpired();
    return batches.map(formatBatch);
  }

  async getFEFOBatches(productId: string, requiredQuantity: number) {
    await this.products.getProductById(productId);
    return this.repo.findFEFOCandidates(productId, requiredQuantity);
  }
}

export const batchesService = new BatchesService();
