import { prisma } from '../../lib/prisma.js';
export class BranchesRepository {
    async findAll(query) {
        const { page, limit, search, isActive, isMain, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const where = {
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
    async findById(id) {
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
    async findByCode(code) {
        return prisma.branch.findUnique({
            where: { code },
        });
    }
    async findMainBranch() {
        return prisma.branch.findFirst({
            where: { isMain: true },
        });
    }
    async unsetAllMainBranches() {
        await prisma.branch.updateMany({
            where: { isMain: true },
            data: { isMain: false },
        });
    }
    async create(data) {
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
    async update(id, data) {
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
    async delete(id) {
        return prisma.branch.update({
            where: { id },
            data: { isActive: false },
        });
    }
}
export const branchesRepository = new BranchesRepository();
//# sourceMappingURL=branches.repository.js.map