import { saleReturnsRepository } from './sale-returns.repository.js';
import { auditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
function formatSaleReturn(raw) {
    return {
        id: raw.id,
        returnNumber: raw.returnNumber,
        saleId: raw.saleId,
        invoiceNumber: raw.sale?.invoiceNumber || '',
        customerId: raw.customerId,
        customerName: raw.customer?.name || null,
        processedById: raw.processedById,
        processedByName: raw.processedBy?.name || 'Staff',
        reason: raw.reason,
        subtotal: Number(raw.subtotal),
        tax: Number(raw.tax),
        total: Number(raw.total),
        createdAt: raw.createdAt,
        items: (raw.items || []).map((i) => ({
            id: i.id,
            saleItemId: i.saleItemId,
            productId: i.productId,
            productName: i.product?.name || 'Unknown Product',
            barcode: i.product?.barcode || '',
            batchId: i.batchId,
            batchNumber: i.batch?.batchNumber || null,
            quantity: i.quantity,
            refundAmount: Number(i.refundAmount),
        })),
    };
}
export class SaleReturnsService {
    repo;
    audit;
    constructor(repo = saleReturnsRepository, audit = auditService) {
        this.repo = repo;
        this.audit = audit;
    }
    async getSaleReturns(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const { items, total } = await this.repo.findMany(filters);
        const pagination = getPaginationMeta(total, page, limit);
        return {
            items: items.map(formatSaleReturn),
            pagination,
        };
    }
    async getSaleReturnById(id) {
        const saleReturn = await this.repo.findById(id);
        if (!saleReturn) {
            throw new NotFoundError(`Sale return with ID '${id}' not found`);
        }
        return formatSaleReturn(saleReturn);
    }
    async getReturnsBySaleId(saleId) {
        const returns = await this.repo.findBySaleId(saleId);
        return returns.map(formatSaleReturn);
    }
    async createSaleReturn(input, processedById) {
        const sale = await this.repo.findSaleWithItems(input.saleId);
        if (!sale) {
            throw new NotFoundError(`Sale with ID '${input.saleId}' not found`);
        }
        if (sale.status === 'CANCELLED') {
            throw new BadRequestError(`Cannot process return for a cancelled sale (${sale.invoiceNumber})`);
        }
        if (sale.status === 'RETURNED') {
            throw new BadRequestError(`All items for sale '${sale.invoiceNumber}' have already been completely returned`);
        }
        let subtotalRefund = 0;
        const planItems = [];
        for (const item of input.items) {
            const saleItem = sale.items.find((si) => si.id === item.saleItemId);
            if (!saleItem) {
                throw new BadRequestError(`Sale item with ID '${item.saleItemId}' does not belong to sale '${sale.invoiceNumber}'`);
            }
            // Calculate past returns for this specific sale item
            const alreadyReturned = (saleItem.returnItems || []).reduce((sum, r) => sum + r.quantity, 0);
            const remainingReturnable = saleItem.quantity - alreadyReturned;
            if (item.quantity > remainingReturnable) {
                throw new BadRequestError(`Cannot return ${item.quantity} units of '${saleItem.product.name}'. Remaining returnable quantity: ${remainingReturnable}`);
            }
            // Proportional refund calculation based on the actual net sale item total
            const unitRefund = Number(saleItem.total) / saleItem.quantity;
            const lineRefund = Number((unitRefund * item.quantity).toFixed(2));
            subtotalRefund += lineRefund;
            planItems.push({
                saleItemId: saleItem.id,
                productId: saleItem.productId,
                batchId: saleItem.batchId,
                quantity: item.quantity,
                refundAmount: lineRefund,
            });
        }
        subtotalRefund = Number(subtotalRefund.toFixed(2));
        // Calculate Commission Reversal if cashier received commission for this sale
        let commissionReversal = null;
        const originalCommissionTx = sale.commissionTransactions?.[0];
        if (originalCommissionTx && Number(originalCommissionTx.commissionAmount) > 0) {
            const originalSaleTotal = Number(sale.total);
            const originalCommissionAmt = Number(originalCommissionTx.commissionAmount);
            const commissionRate = Number(originalCommissionTx.commissionRate);
            if (originalSaleTotal > 0) {
                const reversedCommAmount = Number(((subtotalRefund / originalSaleTotal) * originalCommissionAmt).toFixed(2));
                commissionReversal = {
                    userId: originalCommissionTx.userId,
                    ruleId: originalCommissionTx.commissionRuleId,
                    rate: commissionRate,
                    amount: reversedCommAmount,
                };
            }
        }
        // Calculate Loyalty Points Reversal (1 point per 10 EGP refunded)
        let loyaltyReversalPoints = 0;
        if (sale.customerId && subtotalRefund > 0) {
            loyaltyReversalPoints = Math.floor(subtotalRefund / 10);
        }
        const plan = {
            saleId: sale.id,
            customerId: sale.customerId,
            processedById,
            reason: input.reason || null,
            subtotal: subtotalRefund,
            tax: 0,
            total: subtotalRefund,
            items: planItems,
            commissionReversal,
            loyaltyReversalPoints,
        };
        const createdReturn = await this.repo.createSaleReturnAtomic(plan);
        return formatSaleReturn(createdReturn);
    }
}
export const saleReturnsService = new SaleReturnsService();
//# sourceMappingURL=sale-returns.service.js.map