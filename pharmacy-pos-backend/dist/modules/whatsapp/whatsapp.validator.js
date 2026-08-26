import { z } from 'zod';
const whatsappStatusEnum = ['PENDING', 'SENT', 'FAILED'];
export const whatsappMessageIdParamSchema = z.object({
    id: z.string().uuid('WhatsApp Message ID must be a valid UUID'),
});
export const whatsappQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    customerId: z.string().uuid().optional(),
    saleId: z.string().uuid().optional(),
    phone: z.string().optional(),
    status: z.enum(whatsappStatusEnum).optional(),
    from: z.string().optional(),
    to: z.string().optional(),
});
//# sourceMappingURL=whatsapp.validator.js.map