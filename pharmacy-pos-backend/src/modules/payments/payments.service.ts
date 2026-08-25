import { paymentsRepository, PaymentsRepository } from './payments.repository.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import {
  PaymentResponse,
  PaymentQueryFilters,
  PaginatedPaymentsResponse,
} from './payments.types.js';
import { NotFoundError } from '../../utils/errors.js';

function formatPayment(raw: any): PaymentResponse {
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
  constructor(private readonly repo: PaymentsRepository = paymentsRepository) {}

  async getPayments(filters: PaymentQueryFilters): Promise<PaginatedPaymentsResponse> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const { items, total } = await this.repo.findMany(filters);
    const pagination = getPaginationMeta(total, page, limit);

    return {
      items: items.map(formatPayment),
      pagination,
    };
  }

  async getPaymentById(id: string): Promise<PaymentResponse> {
    const payment = await this.repo.findById(id);
    if (!payment) {
      throw new NotFoundError(`Payment with ID '${id}' not found`);
    }
    return formatPayment(payment);
  }

  async getPaymentsBySaleId(saleId: string): Promise<PaymentResponse[]> {
    const payments = await this.repo.findBySaleId(saleId);
    return payments.map(formatPayment);
  }
}

export const paymentsService = new PaymentsService();
