import { customersRepository } from './customers.repository.js';
import { auditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
function formatCustomer(raw) {
    return {
        id: raw.id,
        name: raw.name,
        phone: raw.phone,
        email: raw.email,
        address: raw.address,
        notes: raw.notes,
        dateOfBirth: raw.dateOfBirth,
        gender: raw.gender,
        tierId: raw.tierId,
        isActive: raw.isActive,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        tier: raw.tier
            ? {
                id: raw.tier.id,
                name: raw.tier.name,
                discountPercentage: Number(raw.tier.discountPercentage),
                minimumPoints: raw.tier.minimumPoints,
                description: raw.tier.description,
            }
            : null,
        loyaltyAccount: raw.loyaltyAccount
            ? {
                id: raw.loyaltyAccount.id,
                totalPoints: raw.loyaltyAccount.totalPoints,
                createdAt: raw.loyaltyAccount.createdAt,
                updatedAt: raw.loyaltyAccount.updatedAt,
            }
            : null,
    };
}
export class CustomersService {
    repo;
    audit;
    constructor(repo = customersRepository, audit = auditService) {
        this.repo = repo;
        this.audit = audit;
    }
    async getCustomers(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const { items, total } = await this.repo.findMany(filters);
        const pagination = getPaginationMeta(total, page, limit);
        return {
            items: items.map(formatCustomer),
            pagination,
        };
    }
    async getCustomerById(id) {
        const customer = await this.repo.findById(id);
        if (!customer) {
            throw new NotFoundError(`Customer with ID '${id}' not found`);
        }
        return formatCustomer(customer);
    }
    async createCustomer(input, actorId) {
        const phone = input.phone.trim();
        // 1. Uniqueness check on phone
        const existingPhone = await this.repo.findByPhone(phone);
        if (existingPhone) {
            throw new ConflictError(`Phone number '${phone}' is already registered to customer '${existingPhone.name}'`);
        }
        // 2. Uniqueness check on email if provided
        if (input.email && input.email.trim()) {
            const email = input.email.trim();
            const existingEmail = await this.repo.findByEmail(email);
            if (existingEmail) {
                throw new ConflictError(`Email address '${email}' is already registered to another customer`);
            }
        }
        // 3. Resolve default tier if none provided
        let tierId = input.tierId || null;
        if (!tierId) {
            const defaultTier = await this.repo.findDefaultTier();
            if (defaultTier) {
                tierId = defaultTier.id;
            }
        }
        let dateOfBirth = null;
        if (input.dateOfBirth) {
            dateOfBirth = new Date(input.dateOfBirth);
        }
        const newCustomer = await this.repo.create({
            name: input.name.trim(),
            phone,
            email: input.email ? input.email.trim() : null,
            address: input.address ? input.address.trim() : null,
            notes: input.notes ? input.notes.trim() : null,
            dateOfBirth,
            gender: input.gender || null,
            tierId,
        });
        // Record creation in audit logs
        await this.audit.logAction({
            userId: actorId || null,
            action: 'CREATE',
            entity: 'customers',
            entityId: newCustomer.id,
            newData: { name: newCustomer.name, phone: newCustomer.phone, tierId: newCustomer.tierId },
        });
        return formatCustomer(newCustomer);
    }
    async updateCustomer(id, input, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Customer with ID '${id}' not found`);
        }
        // Uniqueness validation on phone
        if (input.phone && input.phone.trim() !== existing.phone) {
            const phone = input.phone.trim();
            const phoneTaken = await this.repo.findByPhone(phone);
            if (phoneTaken && phoneTaken.id !== id) {
                throw new ConflictError(`Phone number '${phone}' is already registered to another customer`);
            }
        }
        // Uniqueness validation on email
        if (input.email && input.email.trim() !== existing.email) {
            const email = input.email.trim();
            const emailTaken = await this.repo.findByEmail(email);
            if (emailTaken && emailTaken.id !== id) {
                throw new ConflictError(`Email address '${email}' is already registered to another customer`);
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
        if (input.notes !== undefined)
            updateData.notes = input.notes ? input.notes.trim() : null;
        if (input.dateOfBirth !== undefined)
            updateData.dateOfBirth = input.dateOfBirth ? new Date(input.dateOfBirth) : null;
        if (input.gender !== undefined)
            updateData.gender = input.gender || null;
        if (input.tierId !== undefined)
            updateData.tierId = input.tierId || null;
        if (typeof input.isActive === 'boolean')
            updateData.isActive = input.isActive;
        const updated = await this.repo.update(id, updateData);
        // Record update audit log
        await this.audit.logAction({
            userId: actorId || null,
            action: 'UPDATE',
            entity: 'customers',
            entityId: id,
            oldData: { name: existing.name, phone: existing.phone, isActive: existing.isActive },
            newData: { name: updated.name, phone: updated.phone, isActive: updated.isActive },
        });
        return formatCustomer(updated);
    }
    async deleteCustomer(id, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Customer with ID '${id}' not found`);
        }
        // Soft delete to protect financial/sales integrity
        const deactivated = await this.repo.softDelete(id);
        // Record deactivation audit log
        await this.audit.logAction({
            userId: actorId || null,
            action: 'DELETE',
            entity: 'customers',
            entityId: id,
            metadata: { reason: 'Soft deactivation by staff' },
        });
        return formatCustomer(deactivated);
    }
    async getCustomerPurchases(id, pageQuery) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Customer with ID '${id}' not found`);
        }
        const page = Math.max(1, Number(pageQuery.page) || 1);
        const limit = Math.max(1, Number(pageQuery.limit) || 20);
        const { sales, total } = await this.repo.findCustomerPurchases(id, page, limit);
        const pagination = getPaginationMeta(total, page, limit);
        return {
            items: sales.map((s) => ({
                id: s.id,
                invoiceNumber: s.invoiceNumber,
                saleDate: s.createdAt,
                subtotal: Number(s.subtotal),
                discount: Number(s.discount),
                tax: Number(s.tax),
                total: Number(s.total),
                paidAmount: Number(s.paidAmount),
                remainingAmount: Number(s.remainingAmount),
                status: s.status,
            })),
            pagination,
        };
    }
}
export const customersService = new CustomersService();
//# sourceMappingURL=customers.service.js.map