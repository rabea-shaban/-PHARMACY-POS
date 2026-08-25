import { Role } from '@prisma/client';
import { inventoryRepository, InventoryRepository } from './inventory.repository.js';
import { productsService, ProductsService } from '../products/products.service.js';
import { auditService, AuditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { StockAdjustmentDTO, InventoryTransactionQueryDTO } from './inventory.validator.js';
import {
  InventoryTransactionResponse,
  PaginatedInventoryTransactionsResponse,
} from './inventory.types.js';
import { ForbiddenError } from '../../utils/errors.js';

function formatTransaction(raw: any): InventoryTransactionResponse {
  return {
    id: raw.id,
    productId: raw.productId,
    product: raw.product
      ? {
          id: raw.product.id,
          name: raw.product.name,
          barcode: raw.product.barcode,
        }
      : undefined,
    batchId: raw.batchId,
    batch: raw.batch
      ? {
          id: raw.batch.id,
          batchNumber: raw.batch.batchNumber,
          expiryDate: raw.batch.expiryDate,
          quantity: raw.batch.quantity,
        }
      : null,
    quantity: raw.quantity,
    type: raw.type,
    referenceType: raw.referenceType,
    referenceId: raw.referenceId,
    reason: raw.reason,
    createdById: raw.createdById,
    createdBy: raw.createdBy
      ? {
          id: raw.createdBy.id,
          name: raw.createdBy.name,
          role: raw.createdBy.role,
        }
      : null,
    createdAt: raw.createdAt,
  };
}

export class InventoryService {
  constructor(
    private readonly repo: InventoryRepository = inventoryRepository,
    private readonly products: ProductsService = productsService,
    private readonly audit: AuditService = auditService
  ) {}

  async getTransactions(filters: InventoryTransactionQueryDTO): Promise<PaginatedInventoryTransactionsResponse> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const { items, total } = await this.repo.findMany(filters);
    const pagination = getPaginationMeta(total, page, limit);

    return {
      items: items.map(formatTransaction),
      pagination,
    };
  }

  async getProductTransactions(
    productId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedInventoryTransactionsResponse> {
    await this.products.getProductById(productId);
    const { items, total } = await this.repo.findByProductId(productId, page, limit);
    const pagination = getPaginationMeta(total, page, limit);

    return {
      items: items.map(formatTransaction),
      pagination,
    };
  }

  async getBatchTransactions(
    batchId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedInventoryTransactionsResponse> {
    const { items, total } = await this.repo.findByBatchId(batchId, page, limit);
    const pagination = getPaginationMeta(total, page, limit);

    return {
      items: items.map(formatTransaction),
      pagination,
    };
  }

  async adjustStock(input: StockAdjustmentDTO, actorId?: string, actorRole?: Role) {
    // Only managers can execute manual stock adjustments
    if (actorRole !== 'PLATFORM_MANAGER' && actorRole !== 'PHARMACY_MANAGER') {
      throw new ForbiddenError('Only Pharmacy Managers and Platform Managers can perform stock adjustments');
    }

    const result = await this.repo.recordStockMovementAtomic({
      productId: input.productId,
      batchId: input.batchId,
      quantityDelta: input.quantity,
      type: input.type,
      reason: input.reason,
      referenceType: input.referenceType || 'MANUAL_ADJUSTMENT',
      referenceId: input.referenceId || null,
      actorId,
    });

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'INVENTORY_ADJUSTMENT',
      entity: 'inventory_transactions',
      entityId: result.transaction.id,
      newData: {
        productId: input.productId,
        batchId: input.batchId,
        quantityDelta: input.quantity,
        newBatchQuantity: result.newQuantity,
        type: input.type,
        reason: input.reason,
      },
    });

    return {
      transactionId: result.transaction.id,
      productId: input.productId,
      batchId: input.batchId,
      quantityChanged: input.quantity,
      newBatchQuantity: result.newQuantity,
      type: input.type,
      reason: input.reason,
      createdAt: result.transaction.createdAt,
    };
  }

  async getLowStockReport() {
    return this.products.getLowStockProducts();
  }

  async getExpiringReport(daysAhead = 30) {
    return this.products.getExpiringProducts(daysAhead);
  }
}

export const inventoryService = new InventoryService();
