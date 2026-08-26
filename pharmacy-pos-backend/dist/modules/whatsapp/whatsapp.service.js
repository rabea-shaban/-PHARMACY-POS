import { whatsAppRepository } from './whatsapp.repository.js';
import { defaultWhatsAppProvider, MockWhatsAppProvider } from './whatsapp.provider.js';
import { notificationsService } from '../notifications/notifications.service.js';
import { auditService } from '../audit/audit.service.js';
import { eventBus } from '../../lib/events.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
import { WhatsAppStatus } from '@prisma/client';
function formatWhatsAppMessage(raw) {
    return {
        id: raw.id,
        customerId: raw.customerId,
        customerName: raw.customer?.name || null,
        saleId: raw.saleId,
        saleInvoiceNumber: raw.sale?.invoiceNumber || null,
        phone: raw.phone,
        message: raw.message,
        status: raw.status,
        providerMessageId: raw.providerMessageId,
        errorMessage: raw.errorMessage,
        sentAt: raw.sentAt,
        createdAt: raw.createdAt,
    };
}
export class WhatsAppService {
    repo;
    provider;
    notifications;
    audit;
    constructor(repo = whatsAppRepository, provider = defaultWhatsAppProvider, notifications = notificationsService, audit = auditService) {
        this.repo = repo;
        this.provider = provider;
        this.notifications = notifications;
        this.audit = audit;
        // Listen to decoupled SALE_COMPLETED events
        eventBus.onSaleCompleted((payload) => {
            this.enqueueInvoiceMessage(payload).catch((err) => {
                console.error('[WhatsApp Worker] Failed to enqueue invoice message:', err);
            });
        });
    }
    generateInvoiceMessage(data) {
        const name = data.customerName || 'عميلنا العزيز';
        return `أهلاً ${name} 👋\n\nتم إتمام عملية الشراء بنجاح.\n\nرقم الفاتورة: ${data.invoiceNumber}\nإجمالي الفاتورة: ${data.total} EGP\n\nشكرًا لتعاملك معنا ❤️`;
    }
    async enqueueInvoiceMessage(input) {
        const phone = input.customerPhone?.trim();
        if (!phone) {
            // No phone number -> Skip WhatsApp without failing the sale
            return null;
        }
        // Idempotency: Check if an active/sent message already exists for this sale
        const existing = await this.repo.findBySaleId(input.saleId);
        if (existing && (existing.status === WhatsAppStatus.SENT || existing.status === WhatsAppStatus.PENDING)) {
            return formatWhatsAppMessage(existing);
        }
        const messageText = this.generateInvoiceMessage({
            customerName: input.customerName,
            invoiceNumber: input.invoiceNumber,
            total: input.total,
        });
        const created = await this.repo.create({
            customerId: input.customerId,
            saleId: input.saleId,
            phone,
            message: messageText,
            status: WhatsAppStatus.PENDING,
        });
        // Asynchronously dispatch the background worker (fire & forget, decoupled from Sale transaction)
        setImmediate(() => {
            this.processMessageWithRetries(created.id, 3).catch((err) => {
                console.error(`[WhatsApp Worker] Error processing message ${created.id}:`, err);
            });
        });
        return formatWhatsAppMessage(created);
    }
    async processMessageWithRetries(messageId, maxAttempts = 3) {
        const message = await this.repo.findById(messageId);
        if (!message || message.status === WhatsAppStatus.SENT) {
            return;
        }
        let attempts = 0;
        let lastError = '';
        while (attempts < maxAttempts) {
            attempts++;
            const result = await this.provider.sendMessage(message.phone, message.message);
            if (result.success) {
                await this.repo.update(messageId, {
                    status: WhatsAppStatus.SENT,
                    providerMessageId: result.providerMessageId,
                    errorMessage: null,
                    sentAt: new Date(),
                });
                await this.audit.logAction({
                    action: 'CREATE',
                    entity: 'whatsapp_messages',
                    entityId: messageId,
                    newData: { status: 'SENT', providerMessageId: result.providerMessageId, phone: message.phone },
                });
                return;
            }
            else {
                lastError = result.errorMessage || 'Provider delivery error';
            }
        }
        // If all attempts failed: Mark as FAILED and notify managers
        await this.repo.update(messageId, {
            status: WhatsAppStatus.FAILED,
            errorMessage: `Failed after ${maxAttempts} attempts: ${lastError}`,
        });
        await this.audit.logAction({
            action: 'UPDATE',
            entity: 'whatsapp_messages',
            entityId: messageId,
            newData: { status: 'FAILED', error: lastError },
        });
        // Send internal staff notification to managers
        await this.notifications.notifyRoles({
            roles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'],
            title: 'WhatsApp Invoice Delivery Failed',
            message: `Failed to deliver invoice WhatsApp message to ${message.phone}. Reason: ${lastError}`,
            type: 'SYSTEM_ALERT',
        });
    }
    async retryMessage(id, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`WhatsApp message with ID '${id}' not found`);
        }
        if (existing.status === WhatsAppStatus.SENT) {
            throw new ConflictError(`Cannot retry a message that has already been successfully sent`);
        }
        // Reset status to PENDING
        const updated = await this.repo.update(id, {
            status: WhatsAppStatus.PENDING,
            errorMessage: null,
        });
        // Trigger retry worker
        setImmediate(() => {
            this.processMessageWithRetries(id, 3).catch((err) => {
                console.error(`[WhatsApp Worker] Retry failed for message ${id}:`, err);
            });
        });
        await this.audit.logAction({
            userId: actorId,
            action: 'UPDATE',
            entity: 'whatsapp_messages',
            entityId: id,
            metadata: { action: 'MANUAL_RETRY', phone: existing.phone },
        });
        return formatWhatsAppMessage(updated);
    }
    async getMessages(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const { items, total } = await this.repo.findMany({
            page,
            limit,
            customerId: filters.customerId,
            saleId: filters.saleId,
            phone: filters.phone,
            status: filters.status,
            from: filters.from,
            to: filters.to,
        });
        return {
            items: items.map(formatWhatsAppMessage),
            pagination: getPaginationMeta(total, page, limit),
        };
    }
    async getMessageById(id) {
        const message = await this.repo.findById(id);
        if (!message) {
            throw new NotFoundError(`WhatsApp message with ID '${id}' not found`);
        }
        return formatWhatsAppMessage(message);
    }
    // Testing helper to access mock provider
    getMockProvider() {
        if (this.provider instanceof MockWhatsAppProvider) {
            return this.provider;
        }
        return null;
    }
}
export const whatsAppService = new WhatsAppService();
//# sourceMappingURL=whatsapp.service.js.map