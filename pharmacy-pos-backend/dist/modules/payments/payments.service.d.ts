import { PaymentsRepository } from './payments.repository.js';
import { PaymentResponse, PaymentQueryFilters, PaginatedPaymentsResponse } from './payments.types.js';
export declare class PaymentsService {
    private readonly repo;
    constructor(repo?: PaymentsRepository);
    getPayments(filters: PaymentQueryFilters): Promise<PaginatedPaymentsResponse>;
    getPaymentById(id: string): Promise<PaymentResponse>;
    getPaymentsBySaleId(saleId: string): Promise<PaymentResponse[]>;
}
export declare const paymentsService: PaymentsService;
