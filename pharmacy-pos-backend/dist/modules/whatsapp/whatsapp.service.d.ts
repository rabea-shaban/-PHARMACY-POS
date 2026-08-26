import { WhatsAppRepository } from './whatsapp.repository.js';
import { MockWhatsAppProvider } from './whatsapp.provider.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { AuditService } from '../audit/audit.service.js';
import { WhatsAppMessageResponse, EnqueueInvoiceMessageInput, PaginatedWhatsAppMessagesResponse, IWhatsAppProvider } from './whatsapp.types.js';
import { WhatsAppQueryDTO } from './whatsapp.validator.js';
export declare class WhatsAppService {
    private readonly repo;
    private readonly provider;
    private readonly notifications;
    private readonly audit;
    constructor(repo?: WhatsAppRepository, provider?: IWhatsAppProvider, notifications?: NotificationsService, audit?: AuditService);
    generateInvoiceMessage(data: {
        customerName?: string | null;
        invoiceNumber: string;
        total: number;
    }): string;
    enqueueInvoiceMessage(input: EnqueueInvoiceMessageInput): Promise<WhatsAppMessageResponse | null>;
    processMessageWithRetries(messageId: string, maxAttempts?: number): Promise<void>;
    retryMessage(id: string, actorId: string): Promise<WhatsAppMessageResponse>;
    getMessages(filters: WhatsAppQueryDTO): Promise<PaginatedWhatsAppMessagesResponse>;
    getMessageById(id: string): Promise<WhatsAppMessageResponse>;
    getMockProvider(): MockWhatsAppProvider | null;
}
export declare const whatsAppService: WhatsAppService;
