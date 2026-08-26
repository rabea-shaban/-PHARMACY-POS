import { prisma } from '../../lib/prisma.js';
export class AuthRepository {
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
    async findByIdentifier(identifier) {
        return prisma.user.findFirst({
            where: {
                OR: [{ phone: identifier }, { email: identifier }],
            },
        });
    }
    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
            select: this.safeSelect,
        });
    }
    async countUsers() {
        return prisma.user.count();
    }
}
export const authRepository = new AuthRepository();
//# sourceMappingURL=auth.repository.js.map