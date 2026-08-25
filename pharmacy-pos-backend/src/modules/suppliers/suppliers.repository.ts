import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { SupplierQueryFilters } from './suppliers.types.js';

export class SuppliersRepository {
  async findMany(filters: SupplierQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;
    const { search, phone, isActive, sortBy = 'name', sortOrder = 'asc' } = filters;

    const where: Prisma.SupplierWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        { taxNumber: { contains: search } },
      ];
    }

    if (phone) {
      where.phone = { contains: phone };
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        include: {
          _count: {
            select: { purchases: true },
          },
          purchases: {
            select: { total: true },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.supplier.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.supplier.findUnique({
      where: { id },
      include: {
        _count: {
          select: { purchases: true },
        },
        purchases: {
          select: { total: true },
        },
      },
    });
  }

  async findByPhone(phone: string) {
    return prisma.supplier.findUnique({
      where: { phone },
    });
  }

  async create(data: {
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    taxNumber?: string | null;
    notes?: string | null;
  }) {
    return prisma.supplier.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        taxNumber: data.taxNumber || null,
        notes: data.notes || null,
        isActive: true,
      },
      include: {
        _count: {
          select: { purchases: true },
        },
        purchases: {
          select: { total: true },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      phone?: string;
      email?: string | null;
      address?: string | null;
      taxNumber?: string | null;
      notes?: string | null;
      isActive?: boolean;
    }
  ) {
    return prisma.supplier.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { purchases: true },
        },
        purchases: {
          select: { total: true },
        },
      },
    });
  }

  async softDelete(id: string) {
    return prisma.supplier.update({
      where: { id },
      data: { isActive: false },
      include: {
        _count: {
          select: { purchases: true },
        },
        purchases: {
          select: { total: true },
        },
      },
    });
  }

  async findPurchases(supplierId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.purchase.findMany({
        where: { supplierId },
        include: {
          createdBy: {
            select: { id: true, name: true, role: true },
          },
          items: {
            include: {
              product: { select: { id: true, name: true, barcode: true } },
              batch: { select: { id: true, batchNumber: true, expiryDate: true } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { purchaseDate: 'desc' },
      }),
      prisma.purchase.count({ where: { supplierId } }),
    ]);

    return { items, total };
  }
}

export const suppliersRepository = new SuppliersRepository();
