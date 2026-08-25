import { productsRepository, ProductsRepository } from './products.repository.js';
import { categoriesService, CategoriesService } from '../categories/categories.service.js';
import { auditService, AuditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductSearchQueryDTO,
} from './products.validator.js';
import {
  ProductResponse,
  ProductQueryFilters,
  ProductSearchQueryFilters,
  PaginatedProductsResponse,
  LowStockProductItem,
  ExpiringProductItem,
  ProductStockSummaryResponse,
} from './products.types.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';

function formatProduct(raw: any): ProductResponse {
  const currentStock = (raw.batches || []).reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);
  const minimumStock = raw.minimumStock ?? 5;
  const isLowStock = currentStock <= minimumStock;

  return {
    id: raw.id,
    name: raw.name,
    barcode: raw.barcode,
    scientificName: raw.scientificName,
    description: raw.description,
    categoryId: raw.categoryId,
    category: raw.category
      ? {
          id: raw.category.id,
          name: raw.category.name,
        }
      : undefined,
    purchasePrice: Number(raw.purchasePrice),
    sellingPrice: Number(raw.sellingPrice),
    taxRate: Number(raw.taxRate),
    minimumStock,
    currentStock,
    isLowStock,
    isActive: raw.isActive,
    batches: raw.batches?.map((b: any) => ({
      id: b.id,
      batchNumber: b.batchNumber,
      expiryDate: b.expiryDate,
      quantity: b.quantity,
      purchasePrice: Number(b.purchasePrice),
      sellingPrice: Number(b.sellingPrice),
    })),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export class ProductsService {
  constructor(
    private readonly repo: ProductsRepository = productsRepository,
    private readonly categories: CategoriesService = categoriesService,
    private readonly audit: AuditService = auditService
  ) {}

  async getProducts(filters: ProductQueryFilters): Promise<PaginatedProductsResponse> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const { items, total } = await this.repo.findMany(filters);
    const formatted = items.map(formatProduct);

    // If lowStock filter is requested in query
    let filteredItems = formatted;
    if (typeof filters.lowStock === 'boolean') {
      filteredItems = formatted.filter((p) => p.isLowStock === filters.lowStock);
    }

    const pagination = getPaginationMeta(total, page, limit);

    return {
      items: filteredItems,
      pagination,
    };
  }

  async searchProducts(filters: ProductSearchQueryFilters): Promise<ProductResponse[]> {
    const items = await this.repo.searchPOS(filters);
    return items.map(formatProduct);
  }

  async getProductById(id: string): Promise<ProductResponse> {
    const product = await this.repo.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID '${id}' not found`);
    }
    return formatProduct(product);
  }

  async getProductByBarcode(barcode: string): Promise<ProductResponse> {
    const product = await this.repo.findByBarcode(barcode.trim());
    if (!product) {
      throw new NotFoundError(`Product with barcode '${barcode}' not found`);
    }
    return formatProduct(product);
  }

  async getProductStockSummary(id: string, expiringHorizonDays = 30): Promise<ProductStockSummaryResponse> {
    const product = await this.repo.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID '${id}' not found`);
    }

    const now = new Date().getTime();
    const horizonTime = now + expiringHorizonDays * 24 * 60 * 60 * 1000;

    let totalStock = 0;
    let expiredQuantity = 0;
    let expiringSoonQuantity = 0;
    let activeBatchesCount = 0;

    const batches = (product.batches || []).map((b) => {
      const expiryTime = new Date(b.expiryDate).getTime();
      const isExpired = expiryTime < now;
      const isExpiringSoon = !isExpired && expiryTime <= horizonTime;
      const daysToExpiry = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

      if (b.quantity > 0) {
        activeBatchesCount++;
        totalStock += b.quantity;
        if (isExpired) {
          expiredQuantity += b.quantity;
        } else if (isExpiringSoon) {
          expiringSoonQuantity += b.quantity;
        }
      }

      return {
        id: b.id,
        batchNumber: b.batchNumber,
        expiryDate: b.expiryDate,
        quantity: b.quantity,
        purchasePrice: Number(b.purchasePrice),
        sellingPrice: Number(b.sellingPrice),
        isExpired,
        isExpiringSoon,
        daysToExpiry,
      };
    });

    const isLowStock = totalStock <= product.minimumStock;

    return {
      product: {
        id: product.id,
        name: product.name,
        barcode: product.barcode,
        category: product.category.name,
        minimumStock: product.minimumStock,
        purchasePrice: Number(product.purchasePrice),
        sellingPrice: Number(product.sellingPrice),
      },
      totalStock,
      activeBatchesCount,
      expiredQuantity,
      expiringSoonQuantity,
      isLowStock,
      batches,
    };
  }

  async createProduct(input: CreateProductDTO, actorId?: string): Promise<ProductResponse> {
    const barcode = input.barcode.trim();

    // 1. Verify category exists
    await this.categories.getCategoryById(input.categoryId);

    // 2. Duplicate barcode check
    const existing = await this.repo.findByBarcode(barcode);
    if (existing) {
      throw new ConflictError(`Product with barcode '${barcode}' already exists ('${existing.name}')`);
    }

    const created = await this.repo.create({
      name: input.name.trim(),
      barcode,
      scientificName: input.scientificName ? input.scientificName.trim() : null,
      description: input.description ? input.description.trim() : null,
      categoryId: input.categoryId,
      purchasePrice: input.purchasePrice,
      sellingPrice: input.sellingPrice,
      taxRate: input.taxRate,
      minimumStock: input.minimumStock,
    });

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'CREATE',
      entity: 'products',
      entityId: created.id,
      newData: {
        name: created.name,
        barcode: created.barcode,
        purchasePrice: input.purchasePrice,
        sellingPrice: input.sellingPrice,
      },
    });

    return formatProduct(created);
  }

  async updateProduct(id: string, input: UpdateProductDTO, actorId?: string): Promise<ProductResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Product with ID '${id}' not found`);
    }

    // Verify category if updated
    if (input.categoryId && input.categoryId !== existing.categoryId) {
      await this.categories.getCategoryById(input.categoryId);
    }

    // Duplicate barcode check if updated
    if (input.barcode && input.barcode.trim() !== existing.barcode) {
      const barcode = input.barcode.trim();
      const duplicate = await this.repo.findByBarcode(barcode);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictError(`Product with barcode '${barcode}' already exists ('${duplicate.name}')`);
      }
    }

    const updateData: {
      name?: string;
      barcode?: string;
      scientificName?: string | null;
      description?: string | null;
      categoryId?: string;
      purchasePrice?: number;
      sellingPrice?: number;
      taxRate?: number;
      minimumStock?: number;
      isActive?: boolean;
    } = {};

    if (input.name) updateData.name = input.name.trim();
    if (input.barcode) updateData.barcode = input.barcode.trim();
    if (input.scientificName !== undefined) updateData.scientificName = input.scientificName ? input.scientificName.trim() : null;
    if (input.description !== undefined) updateData.description = input.description ? input.description.trim() : null;
    if (input.categoryId) updateData.categoryId = input.categoryId;
    if (input.purchasePrice !== undefined) updateData.purchasePrice = input.purchasePrice;
    if (input.sellingPrice !== undefined) updateData.sellingPrice = input.sellingPrice;
    if (input.taxRate !== undefined) updateData.taxRate = input.taxRate;
    if (input.minimumStock !== undefined) updateData.minimumStock = input.minimumStock;
    if (typeof input.isActive === 'boolean') updateData.isActive = input.isActive;

    const updated = await this.repo.update(id, updateData);

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'UPDATE',
      entity: 'products',
      entityId: id,
      oldData: { name: existing.name, barcode: existing.barcode, isActive: existing.isActive },
      newData: { name: updated.name, barcode: updated.barcode, isActive: updated.isActive },
    });

    return formatProduct(updated);
  }

  async deleteProduct(id: string, actorId?: string): Promise<ProductResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Product with ID '${id}' not found`);
    }

    // Soft delete to protect historical sales and batch records
    const deactivated = await this.repo.softDelete(id);

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'DELETE',
      entity: 'products',
      entityId: id,
      metadata: { reason: 'Soft deactivation of product' },
    });

    return formatProduct(deactivated);
  }

  async getLowStockProducts(): Promise<LowStockProductItem[]> {
    const products = await this.repo.findLowStock();
    return products.map((p) => {
      const currentStock = p.batches.reduce((sum, b) => sum + b.quantity, 0);
      return {
        id: p.id,
        name: p.name,
        barcode: p.barcode,
        category: p.category.name,
        minimumStock: p.minimumStock,
        currentStock,
        difference: p.minimumStock - currentStock,
      };
    });
  }

  async getExpiringProducts(daysAhead = 30): Promise<ExpiringProductItem[]> {
    const batches = await this.repo.findExpiring(daysAhead);
    const now = new Date().getTime();

    return batches.map((b) => {
      const expiryTime = new Date(b.expiryDate).getTime();
      const daysRemaining = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

      return {
        id: b.product.id,
        name: b.product.name,
        barcode: b.product.barcode,
        category: b.product.category.name,
        batchNumber: b.batchNumber,
        expiryDate: b.expiryDate,
        daysRemaining,
        quantity: b.quantity,
      };
    });
  }
}

export const productsService = new ProductsService();
