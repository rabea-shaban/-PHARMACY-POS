import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { ProductQueryFilters, ProductSearchQueryFilters } from './products.types.js';

export class ProductsRepository {
  private readonly defaultInclude = {
    category: {
      select: {
        id: true,
        name: true,
      },
    },
    batches: {
      select: {
        id: true,
        batchNumber: true,
        expiryDate: true,
        quantity: true,
        purchasePrice: true,
        sellingPrice: true,
      },
      orderBy: { expiryDate: 'asc' as const },
    },
  };

  async findMany(filters: ProductQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;
    const { search, barcode, categoryId, isActive, sortBy = 'name', sortOrder = 'asc' } = filters;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { barcode: { contains: search } },
        { scientificName: { contains: search } },
      ];
    }

    if (barcode) {
      where.barcode = { contains: barcode };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: this.defaultInclude,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total };
  }

  async searchPOS(filters: ProductSearchQueryFilters) {
    const limit = Math.min(50, Math.max(1, Number(filters.limit) || 20));
    const { q, name, barcode, categoryId } = filters;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (barcode) {
      where.barcode = { contains: barcode };
    } else if (name) {
      where.OR = [
        { name: { contains: name } },
        { scientificName: { contains: name } },
      ];
    } else if (q) {
      where.OR = [
        { barcode: { contains: q } },
        { name: { contains: q } },
        { scientificName: { contains: q } },
      ];
    }

    return prisma.product.findMany({
      where,
      include: this.defaultInclude,
      take: limit,
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
  }

  async findByBarcode(barcode: string) {
    return prisma.product.findUnique({
      where: { barcode },
      include: this.defaultInclude,
    });
  }

  async create(data: {
    name: string;
    barcode: string;
    scientificName?: string | null;
    description?: string | null;
    categoryId: string;
    purchasePrice: number;
    sellingPrice: number;
    taxRate?: number;
    minimumStock?: number;
  }) {
    return prisma.product.create({
      data: {
        name: data.name,
        barcode: data.barcode,
        scientificName: data.scientificName || null,
        description: data.description || null,
        categoryId: data.categoryId,
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        taxRate: data.taxRate ?? 0.0,
        minimumStock: data.minimumStock ?? 5,
        isActive: true,
      },
      include: this.defaultInclude,
    });
  }

  async update(
    id: string,
    data: {
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
    }
  ) {
    return prisma.product.update({
      where: { id },
      data,
      include: this.defaultInclude,
    });
  }

  async softDelete(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
      include: this.defaultInclude,
    });
  }

  async findLowStock() {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: { select: { id: true, name: true } },
        batches: {
          select: { quantity: true, expiryDate: true },
        },
      },
    });

    return products.filter((p) => {
      const currentStock = p.batches.reduce((sum, b) => sum + b.quantity, 0);
      return currentStock <= p.minimumStock;
    });
  }

  async findExpiring(daysAhead = 30) {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysAhead);

    return prisma.batch.findMany({
      where: {
        expiryDate: {
          lte: thresholdDate,
        },
        quantity: { gt: 0 },
        product: { isActive: true },
      },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { expiryDate: 'asc' },
    });
  }
}

export const productsRepository = new ProductsRepository();
