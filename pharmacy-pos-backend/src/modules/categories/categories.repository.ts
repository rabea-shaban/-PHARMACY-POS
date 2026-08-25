import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CategoryQueryFilters } from './categories.types.js';

export class CategoriesRepository {
  async findMany(filters: CategoryQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;
    const { search, isActive, sortBy = 'name', sortOrder = 'asc' } = filters;

    const where: Prisma.CategoryWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          _count: {
            select: { products: true },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.category.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findByName(name: string) {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  async create(data: { name: string; description?: string | null }) {
    return prisma.category.create({
      data: {
        name: data.name,
        description: data.description || null,
        isActive: true,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async update(id: string, data: { name?: string; description?: string | null; isActive?: boolean }) {
    return prisma.category.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async softDelete(id: string) {
    return prisma.category.update({
      where: { id },
      data: { isActive: false },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }
}

export const categoriesRepository = new CategoriesRepository();
