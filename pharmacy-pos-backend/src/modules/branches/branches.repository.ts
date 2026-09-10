import { prisma } from '../../lib/prisma.js';
import { Branch, Prisma } from '@prisma/client';
import { CreateBranchDTO, UpdateBranchDTO, BranchQueryDTO } from './branches.validator.js';

export interface BranchWithStats extends Branch {
  _count?: {
    users: number;
    batches: number;
    sales: number;
  };
}

export class BranchesRepository {
  async findAll(query: BranchQueryDTO): Promise<{ branches: BranchWithStats[]; total: number }> {
    const { page, limit, search, isActive, isMain, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BranchWhereInput = {
      ...(isActive !== undefined && { isActive }),
      ...(isMain !== undefined && { isMain }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { code: { contains: search } },
          { address: { contains: search } },
          { phone: { contains: search } },
        ],
      }),
    };

    const [branches, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              users: true,
              batches: true,
              sales: true,
            },
          },
        },
      }),
      prisma.branch.count({ where }),
    ]);

    return { branches, total };
  }

  async findById(id: string): Promise<BranchWithStats | null> {
    return prisma.branch.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            batches: true,
            sales: true,
          },
        },
      },
    });
  }

  async findByCode(code: string): Promise<Branch | null> {
    return prisma.branch.findUnique({
      where: { code },
    });
  }

  async findMainBranch(): Promise<Branch | null> {
    return prisma.branch.findFirst({
      where: { isMain: true },
    });
  }

  async unsetAllMainBranches(): Promise<void> {
    await prisma.branch.updateMany({
      where: { isMain: true },
      data: { isMain: false },
    });
  }

  async create(data: CreateBranchDTO): Promise<Branch> {
    return prisma.branch.create({
      data: {
        name: data.name,
        code: data.code,
        address: data.address,
        phone: data.phone,
        isMain: data.isMain ?? false,
      },
    });
  }

  async update(id: string, data: UpdateBranchDTO): Promise<Branch> {
    return prisma.branch.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.code !== undefined && { code: data.code }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.isMain !== undefined && { isMain: data.isMain }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  async delete(id: string): Promise<Branch> {
    return prisma.branch.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export const branchesRepository = new BranchesRepository();
