import { purchasesRepository } from './purchases.repository.js';
import { suppliersService } from '../suppliers/suppliers.service.js';
import { productsService } from '../products/products.service.js';
import { auditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../utils/errors.js';
function formatPurchase(raw) {
    return {
        id: raw.id,
        supplierId: raw.supplierId,
        supplier: raw.supplier
            ? {
                id: raw.supplier.id,
                name: raw.supplier.name,
                phone: raw.supplier.phone,
            }
            : undefined,
        invoiceNumber: raw.invoiceNumber,
        purchaseDate: raw.purchaseDate,
        subtotal: Number(raw.subtotal),
        discount: Number(raw.discount),
        tax: Number(raw.tax),
        total: Number(raw.total),
        paidAmount: Number(raw.paidAmount),
        remainingAmount: Number(raw.remainingAmount),
        status: raw.status,
        notes: raw.notes,
        createdById: raw.createdById,
        createdBy: raw.createdBy
            ? {
                id: raw.createdBy.id,
                name: raw.createdBy.name,
                role: raw.createdBy.role,
            }
            : undefined,
        items: raw.items?.map((item) => ({
            id: item.id,
            purchaseId: item.purchaseId,
            productId: item.productId,
            product: item.product
                ? {
                    id: item.product.id,
                    name: item.product.name,
                    barcode: item.product.barcode,
                }
                : undefined,
            batchId: item.batchId,
            batch: item.batch
                ? {
                    id: item.batch.id,
                    batchNumber: item.batch.batchNumber,
                    expiryDate: item.batch.expiryDate,
                    quantity: item.batch.quantity,
                }
                : null,
            quantity: item.quantity,
            unitCost: Number(item.unitCost),
            discount: Number(item.discount),
            tax: Number(item.tax),
            total: Number(item.total),
        })),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
}
export class PurchasesService {
    repo;
    suppliers;
    products;
    audit;
    constructor(repo = purchasesRepository, suppliers = suppliersService, products = productsService, audit = auditService) {
        this.repo = repo;
        this.suppliers = suppliers;
        this.products = products;
        this.audit = audit;
    }
    async getPurchases(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const { items, total } = await this.repo.findMany(filters);
        const pagination = getPaginationMeta(total, page, limit);
        return {
            items: items.map(formatPurchase),
            pagination,
        };
    }
    async getPurchaseById(id) {
        const purchase = await this.repo.findById(id);
        if (!purchase) {
            throw new NotFoundError(`Purchase with ID '${id}' not found`);
        }
        return formatPurchase(purchase);
    }
    async createPurchase(input, actorId) {
        const invoiceNumber = input.invoiceNumber.trim();
        // 1. Verify supplier exists and is active
        const supplier = await this.suppliers.getSupplierById(input.supplierId);
        if (!supplier.isActive) {
            throw new BadRequestError(`Supplier '${supplier.name}' is deactivated`);
        }
        // 2. Duplicate invoice number check
        const existing = await this.repo.findByInvoiceNumber(invoiceNumber);
        if (existing) {
            throw new ConflictError(`Purchase with invoice number '${invoiceNumber}' already exists`);
        }
        // 3. Verify all products exist and calculate item totals
        let calculatedSubtotal = 0;
        const processedItems = [];
        for (const item of input.items) {
            const product = await this.products.getProductById(item.productId);
            if (!product.isActive) {
                throw new BadRequestError(`Product '${product.name}' is deactivated`);
            }
            const quantity = item.quantity;
            const unitCost = item.unitCost;
            const discount = item.discount || 0.0;
            const tax = item.tax || 0.0;
            const itemRawCost = quantity * unitCost;
            const itemTotal = itemRawCost - discount + tax;
            calculatedSubtotal += itemRawCost;
            processedItems.push({
                productId: item.productId,
                quantity,
                unitCost,
                discount,
                tax,
                total: itemTotal,
                batchNumber: item.batchNumber,
                expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
                sellingPrice: item.sellingPrice,
            });
        }
        // 4. Calculate overall purchase totals
        const invoiceDiscount = input.discount || 0.0;
        const invoiceTax = input.tax || 0.0;
        const total = Math.max(0, calculatedSubtotal - invoiceDiscount + invoiceTax);
        const paidAmount = Math.min(input.paidAmount || 0.0, total);
        const remainingAmount = Math.max(0, total - paidAmount);
        const created = await this.repo.create({
            supplierId: input.supplierId,
            invoiceNumber,
            purchaseDate: input.purchaseDate ? new Date(input.purchaseDate) : new Date(),
            subtotal: calculatedSubtotal,
            discount: invoiceDiscount,
            tax: invoiceTax,
            total,
            paidAmount,
            remainingAmount,
            status: 'PENDING',
            createdById: actorId,
            notes: input.notes ? input.notes.trim() : null,
            items: processedItems,
        });
        if (!created) {
            throw new BadRequestError('Failed to create purchase invoice');
        }
        // Record audit log
        await this.audit.logAction({
            userId: actorId,
            action: 'CREATE',
            entity: 'purchases',
            entityId: created.id,
            newData: {
                invoiceNumber: created.invoiceNumber,
                supplierId: created.supplierId,
                total,
                itemCount: processedItems.length,
            },
        });
        return formatPurchase(created);
    }
    async updatePurchase(id, input, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Purchase with ID '${id}' not found`);
        }
        if (existing.status !== 'PENDING') {
            throw new BadRequestError(`Cannot edit purchase with status '${existing.status}'. Only PENDING purchases can be modified.`);
        }
        const subtotal = Number(existing.subtotal);
        const discount = input.discount !== undefined ? input.discount : Number(existing.discount);
        const tax = input.tax !== undefined ? input.tax : Number(existing.tax);
        const total = Math.max(0, subtotal - discount + tax);
        const paidAmount = input.paidAmount !== undefined ? input.paidAmount : Number(existing.paidAmount);
        const remainingAmount = Math.max(0, total - paidAmount);
        const updateData = {
            discount,
            tax,
            total,
            paidAmount,
            remainingAmount,
        };
        if (input.notes !== undefined)
            updateData.notes = input.notes ? input.notes.trim() : null;
        const updated = await this.repo.update(id, updateData);
        // Record audit log
        await this.audit.logAction({
            userId: actorId || null,
            action: 'UPDATE',
            entity: 'purchases',
            entityId: id,
            oldData: { total: existing.total, status: existing.status },
            newData: { total: updated.total, status: updated.status },
        });
        return formatPurchase(updated);
    }
    async receivePurchase(id, input, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Purchase with ID '${id}' not found`);
        }
        if (existing.status !== 'PENDING') {
            throw new BadRequestError(`Cannot receive purchase with status '${existing.status}'. Only PENDING purchases can be received.`);
        }
        const received = await this.repo.receiveAtomic(id, input.items, actorId);
        // Record audit log
        await this.audit.logAction({
            userId: actorId || null,
            action: 'UPDATE',
            entity: 'purchases',
            entityId: id,
            metadata: {
                event: 'PURCHASE_RECEIVE',
                invoiceNumber: received.invoiceNumber,
                status: 'RECEIVED',
                receivedItemCount: received.items.length,
            },
        });
        return formatPurchase(received);
    }
    async cancelPurchase(id, reason, actorId) {
        const cancelled = await this.repo.cancelAtomic(id, reason);
        // Record audit log
        await this.audit.logAction({
            userId: actorId || null,
            action: 'UPDATE',
            entity: 'purchases',
            entityId: id,
            metadata: { event: 'PURCHASE_CANCEL', reason: reason || 'Purchase cancelled' },
        });
        return formatPurchase(cancelled);
    }
}
export const purchasesService = new PurchasesService();
//# sourceMappingURL=purchases.service.js.map