import { suppliersRepository } from './suppliers.repository.js';
import { auditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
function formatSupplier(raw) {
    const totalPurchaseAmount = (raw.purchases || []).reduce((sum, p) => sum + (Number(p.total) || 0), 0);
    return {
        id: raw.id,
        name: raw.name,
        phone: raw.phone,
        email: raw.email,
        address: raw.address,
        taxNumber: raw.taxNumber,
        notes: raw.notes,
        isActive: raw.isActive,
        purchaseCount: raw._count?.purchases ?? 0,
        totalPurchaseAmount,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
    };
}
export class SuppliersService {
    repo;
    audit;
    constructor(repo = suppliersRepository, audit = auditService) {
        this.repo = repo;
        this.audit = audit;
    }
    async getSuppliers(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const { items, total } = await this.repo.findMany(filters);
        const pagination = getPaginationMeta(total, page, limit);
        return {
            items: items.map(formatSupplier),
            pagination,
        };
    }
    async getSupplierById(id) {
        const supplier = await this.repo.findById(id);
        if (!supplier) {
            throw new NotFoundError(`Supplier with ID '${id}' not found`);
        }
        return formatSupplier(supplier);
    }
    async createSupplier(input, actorId) {
        const phone = input.phone.trim();
        // Duplicate phone check
        const existing = await this.repo.findByPhone(phone);
        if (existing) {
            throw new ConflictError(`Supplier with phone '${phone}' already exists ('${existing.name}')`);
        }
        const created = await this.repo.create({
            name: input.name.trim(),
            phone,
            email: input.email ? input.email.trim() : null,
            address: input.address ? input.address.trim() : null,
            taxNumber: input.taxNumber ? input.taxNumber.trim() : null,
            notes: input.notes ? input.notes.trim() : null,
        });
        // Record audit log
        await this.audit.logAction({
            userId: actorId || null,
            action: 'CREATE',
            entity: 'suppliers',
            entityId: created.id,
            newData: { name: created.name, phone: created.phone },
        });
        return formatSupplier(created);
    }
    async updateSupplier(id, input, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Supplier with ID '${id}' not found`);
        }
        if (input.phone && input.phone.trim() !== existing.phone) {
            const phone = input.phone.trim();
            const duplicate = await this.repo.findByPhone(phone);
            if (duplicate && duplicate.id !== id) {
                throw new ConflictError(`Supplier with phone '${phone}' already exists ('${duplicate.name}')`);
            }
        }
        const updateData = {};
        if (input.name)
            updateData.name = input.name.trim();
        if (input.phone)
            updateData.phone = input.phone.trim();
        if (input.email !== undefined)
            updateData.email = input.email ? input.email.trim() : null;
        if (input.address !== undefined)
            updateData.address = input.address ? input.address.trim() : null;
        if (input.taxNumber !== undefined)
            updateData.taxNumber = input.taxNumber ? input.taxNumber.trim() : null;
        if (input.notes !== undefined)
            updateData.notes = input.notes ? input.notes.trim() : null;
        if (typeof input.isActive === 'boolean')
            updateData.isActive = input.isActive;
        const updated = await this.repo.update(id, updateData);
        // Record audit log
        await this.audit.logAction({
            userId: actorId || null,
            action: 'UPDATE',
            entity: 'suppliers',
            entityId: id,
            oldData: { name: existing.name, phone: existing.phone, isActive: existing.isActive },
            newData: { name: updated.name, phone: updated.phone, isActive: updated.isActive },
        });
        return formatSupplier(updated);
    }
    async deleteSupplier(id, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Supplier with ID '${id}' not found`);
        }
        // Soft delete to protect historical purchase invoices
        const deactivated = await this.repo.softDelete(id);
        // Record audit log
        await this.audit.logAction({
            userId: actorId || null,
            action: 'DELETE',
            entity: 'suppliers',
            entityId: id,
            metadata: { reason: 'Soft deactivation of supplier' },
        });
        return formatSupplier(deactivated);
    }
    async getSupplierPurchases(supplierId, page = 1, limit = 20) {
        await this.getSupplierById(supplierId);
        const { items, total } = await this.repo.findPurchases(supplierId, page, limit);
        const pagination = getPaginationMeta(total, page, limit);
        return {
            items: items.map((p) => ({
                id: p.id,
                supplierId: p.supplierId,
                invoiceNumber: p.invoiceNumber,
                purchaseDate: p.purchaseDate,
                subtotal: Number(p.subtotal),
                discount: Number(p.discount),
                tax: Number(p.tax),
                total: Number(p.total),
                paidAmount: Number(p.paidAmount),
                remainingAmount: Number(p.remainingAmount),
                status: p.status,
                itemCount: p.items.length,
                createdBy: p.createdBy ? { id: p.createdBy.id, name: p.createdBy.name } : null,
                createdAt: p.createdAt,
            })),
            pagination,
        };
    }
}
export const suppliersService = new SuppliersService();
//# sourceMappingURL=suppliers.service.js.map