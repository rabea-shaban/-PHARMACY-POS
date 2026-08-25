import { z } from 'zod';

const notificationTypeEnum = ['LOW_STOCK', 'EXPIRY_ALERT', 'SALE_COMPLETED', 'SYSTEM_ALERT', 'GENERAL'] as const;

export const notificationIdParamSchema = z.object({
  id: z.string().uuid('Notification ID must be a valid UUID'),
});

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  isRead: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  type: z.enum(notificationTypeEnum).optional(),
});

export type NotificationQueryDTO = z.infer<typeof notificationQuerySchema>;
