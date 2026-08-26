import { prisma } from '../../lib/prisma.js';
export class UsersRepository {
    safeSelect = {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
    };
    async findMany(params) {
        const page = Math.max(1, Number(params.page) || 1);
        const limit = Math.max(1, Number(params.limit) || 20);
        const { search, role, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = params;
        const skip = (page - 1) * limit;
        const where = {};
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
    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
            select: this.safeSelect,
        });
    }
    async findByIdWithPassword(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }
    async findByPhone(phone) {
        return prisma.user.findUnique({
            where: { phone },
        });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    }
    async create(data) {
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
    async update(id, data) {
        return prisma.user.update({
            where: { id },
            data,
            select: this.safeSelect,
        });
    }
    async softDelete(id) {
        return prisma.user.update({
            where: { id },
            data: { isActive: false },
            select: this.safeSelect,
        });
    }
}
export const usersRepository = new UsersRepository();
//# sourceMappingURL=users.repository.js.map