import { NotificationType } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
export class NotificationsRepository {
    async findMany(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const where = {
            userId: filters.userId,
        };
        if (filters.isRead !== undefined) {
            where.isRead = typeof filters.isRead === 'boolean' ? filters.isRead : String(filters.isRead) === 'true';
        }
        if (filters.type) {
            where.type = filters.type;
        }
        const [items, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.notification.count({ where }),
        ]);
        return { items, total };
    }
    async findById(id) {
        return prisma.notification.findUnique({
            where: { id },
        });
    }
    async countUnread(userId) {
        return prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
    }
    async create(data) {
        return prisma.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type || NotificationType.GENERAL,
            },
        });
    }
    async createMany(notifications) {
        if (notifications.length === 0)
            return { count: 0 };
        return prisma.notification.createMany({
            data: notifications,
        });
    }
    async markAsRead(id, userId) {
        return prisma.notification.updateMany({
            where: {
                id,
                userId,
            },
            data: {
                isRead: true,
            },
        });
    }
    async markAllAsRead(userId) {
        return prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }
    async findUserIdsByRoles(roles) {
        const users = await prisma.user.findMany({
            where: {
                role: { in: roles },
                isActive: true,
            },
            select: { id: true },
        });
        return users.map((u) => u.id);
    }
}
export const notificationsRepository = new NotificationsRepository();
//# sourceMappingURL=notifications.repository.js.map