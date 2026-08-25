import { Prisma, Role } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { UserQueryParams } from './users.types.js';

export class UsersRepository {
  private readonly safeSelect = {
    id: true,
    name: true,
    phone: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  async findMany(params: UserQueryParams) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Number(params.limit) || 20);
    const { search, role, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: this.safeSelect,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: this.safeSelect,
    });
  }

  async findByIdWithPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByPhone(phone: string) {
    return prisma.user.findUnique({
      where: { phone },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    name: string;
    phone: string;
    email?: string | null;
    passwordHash: string;
    role: Role;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        passwordHash: data.passwordHash,
        role: data.role,
        isActive: true,
      },
      select: this.safeSelect,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      phone?: string;
      email?: string | null;
      passwordHash?: string;
      role?: Role;
      isActive?: boolean;
    }
  ) {
    return prisma.user.update({
      where: { id },
      data,
      select: this.safeSelect,
    });
  }

  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: this.safeSelect,
    });
  }
}

export const usersRepository = new UsersRepository();
