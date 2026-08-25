import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { DiscountQueryFilters } from './discounts.types.js';

export class DiscountsRepository {
  async findMany(filters: DiscountQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;
    const { search, code, type, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

    const where: Prisma.DiscountWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
      ];
    }

    if (code) {
      where.code = code;
    }

    if (type) {
      where.type = type;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      prisma.discount.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.discount.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.discount.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string) {
    return prisma.discount.findUnique({
      where: { code },
    });
  }

  async create(data: {
    code?: string | null;
    name: string;
    type: Prisma.DiscountCreateInput['type'];
    value: number;
    minimumPurchase?: number;
    startDate?: Date | null;
    endDate?: Date | null;
  }) {
    return prisma.discount.create({
      data: {
        code: data.code || null,
        name: data.name,
        type: data.type,
        value: data.value,
        minimumPurchase: data.minimumPurchase ?? 0.0,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        isActive: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      code?: string | null;
      name?: string;
      type?: Prisma.DiscountUpdateInput['type'];
      value?: number;
      minimumPurchase?: number;
      startDate?: Date | null;
      endDate?: Date | null;
      isActive?: boolean;
    }
  ) {
    return prisma.discount.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return prisma.discount.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export const discountsRepository = new DiscountsRepository();
