import { Prisma, Gender } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CustomerQueryFilters } from './customers.types.js';

export class CustomersRepository {
  private readonly defaultInclude = {
    tier: {
      select: {
        id: true,
        name: true,
        discountPercentage: true,
        minimumPoints: true,
        description: true,
      },
    },
    loyaltyAccount: {
      select: {
        id: true,
        totalPoints: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  };

  async findMany(filters: CustomerQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;
    const { search, phone, name, tierId, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

    const where: Prisma.CustomerWhereInput = {};

    if (search) {
      where.OR = [
        { phone: { contains: search } },
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (phone) {
      where.phone = { contains: phone };
    }

    if (name) {
      where.name = { contains: name };
    }

    if (tierId) {
      where.tierId = tierId;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: this.defaultInclude,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.customer.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
  }

  async findByPhone(phone: string) {
    return prisma.customer.findUnique({
      where: { phone },
      include: this.defaultInclude,
    });
  }

  async findByEmail(email: string) {
    return prisma.customer.findFirst({
      where: { email },
      include: this.defaultInclude,
    });
  }

  async findDefaultTier() {
    // Prefer tier with name 'REGULAR' or lowest minimumPoints
    const tier = await prisma.customerTier.findFirst({
      where: { isActive: true },
      orderBy: { minimumPoints: 'asc' },
    });
    return tier;
  }

  async create(data: {
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    notes?: string | null;
    dateOfBirth?: Date | null;
    gender?: Gender | null;
    tierId?: string | null;
  }) {
    // Atomic creation of customer + loyalty account
    return prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          address: data.address || null,
          notes: data.notes || null,
          dateOfBirth: data.dateOfBirth || null,
          gender: data.gender || null,
          tierId: data.tierId || null,
          isActive: true,
        },
      });

      const loyaltyAccount = await tx.loyaltyAccount.create({
        data: {
          customerId: customer.id,
          totalPoints: 0,
        },
      });

      const customerWithRelations = await tx.customer.findUnique({
        where: { id: customer.id },
        include: this.defaultInclude,
      });

      return customerWithRelations || { ...customer, tier: null, loyaltyAccount };
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      phone?: string;
      email?: string | null;
      address?: string | null;
      notes?: string | null;
      dateOfBirth?: Date | null;
      gender?: Gender | null;
      tierId?: string | null;
      isActive?: boolean;
    }
  ) {
    return prisma.customer.update({
      where: { id },
      data,
      include: this.defaultInclude,
    });
  }

  async softDelete(id: string) {
    return prisma.customer.update({
      where: { id },
      data: { isActive: false },
      include: this.defaultInclude,
    });
  }

  async findCustomerPurchases(customerId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where: { customerId },
        select: {
          id: true,
          invoiceNumber: true,
          createdAt: true,
          subtotal: true,
          discount: true,
          tax: true,
          total: true,
          paidAmount: true,
          remainingAmount: true,
          status: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sale.count({ where: { customerId } }),
    ]);

    return { sales, total };
  }
}

export const customersRepository = new CustomersRepository();
