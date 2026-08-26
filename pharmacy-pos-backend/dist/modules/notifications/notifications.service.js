import { notificationsRepository } from './notifications.repository.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError } from '../../utils/errors.js';
import { NotificationType } from '@prisma/client';
function formatNotification(raw) {
    return {
        id: raw.id,
        userId: raw.userId,
        title: raw.title,
        message: raw.message,
        type: raw.type,
        isRead: raw.isRead,
        createdAt: raw.createdAt,
    };
}
export class NotificationsService {
    repo;
    constructor(repo = notificationsRepository) {
        this.repo = repo;
    }
    async getUserNotifications(userId, filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const { items, total } = await this.repo.findMany({
            userId,
            page,
            limit,
            isRead: filters.isRead,
            type: filters.type,
        });
        return {
            items: items.map(formatNotification),
            pagination: getPaginationMeta(total, page, limit),
        };
    }
    async getUnreadCount(userId) {
        const unreadCount = await this.repo.countUnread(userId);
        return { unreadCount };
    }
    async markAsRead(id, userId) {
        const existing = await this.repo.findById(id);
        if (!existing || existing.userId !== userId) {
            throw new NotFoundError(`Notification with ID '${id}' not found`);
        }
        await this.repo.markAsRead(id, userId);
        return formatNotification({ ...existing, isRead: true });
    }
    async markAllAsRead(userId) {
        const result = await this.repo.markAllAsRead(userId);
        return { markedCount: result.count };
    }
    async createNotification(input) {
        const created = await this.repo.create({
            userId: input.userId,
            title: input.title,
            message: input.message,
            type: input.type || NotificationType.GENERAL,
        });
        return formatNotification(created);
    }
    async notifyRoles(input) {
        const userIds = await this.repo.findUserIdsByRoles(input.roles);
        if (userIds.length === 0) {
            return { recipientCount: 0 };
        }
        const payload = userIds.map((userId) => ({
            userId,
            title: input.title,
            message: input.message,
            type: input.type || NotificationType.SYSTEM_ALERT,
        }));
        await this.repo.createMany(payload);
        return { recipientCount: userIds.length };
    }
}
export const notificationsService = new NotificationsService();
//# sourceMappingURL=notifications.service.js.map