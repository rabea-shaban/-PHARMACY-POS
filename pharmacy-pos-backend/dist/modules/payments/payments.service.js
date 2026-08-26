import { paymentsRepository } from './payments.repository.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError } from '../../utils/errors.js';
function formatPayment(raw) {
    return {
        id: raw.id,
        saleId: raw.saleId,
        invoiceNumber: raw.sale?.invoiceNumber || undefined,
        amount: Number(raw.amount),
        paymentMethod: raw.paymentMethod,
        referenceNumber: raw.referenceNumber,
        notes: raw.notes,
        createdById: raw.createdById,
        createdByName: raw.createdBy?.name || 'Staff',
        createdAt: raw.createdAt,
    };
}
export class PaymentsService {
    repo;
    constructor(repo = paymentsRepository) {
        this.repo = repo;
    }
    async getPayments(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const { items, total } = await this.repo.findMany(filters);
        const pagination = getPaginationMeta(total, page, limit);
        return {
            items: items.map(formatPayment),
            pagination,
        };
    }
    async getPaymentById(id) {
        const payment = await this.repo.findById(id);
        if (!payment) {
            throw new NotFoundError(`Payment with ID '${id}' not found`);
        }
        return formatPayment(payment);
    }
    async getPaymentsBySaleId(saleId) {
        const payments = await this.repo.findBySaleId(saleId);
        return payments.map(formatPayment);
    }
}
export const paymentsService = new PaymentsService();
//# sourceMappingURL=payments.service.js.map