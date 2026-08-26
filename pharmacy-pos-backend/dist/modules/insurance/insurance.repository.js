import { prisma } from '../../lib/prisma.js';
export class InsuranceRepository {
    async findManyProviders(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const { search, isActive, sortBy = 'name', sortOrder = 'asc' } = filters;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { phone: { contains: search } },
                { email: { contains: search } },
            ];
        }
        if (typeof isActive === 'boolean') {
            where.isActive = isActive;
        }
        const [items, total] = await Promise.all([
            prisma.insuranceProvider.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            prisma.insuranceProvider.count({ where }),
        ]);
        return { items, total };
    }
    async findProviderById(id) {
        return prisma.insuranceProvider.findUnique({
            where: { id },
        });
    }
    async findProviderByName(name) {
        return prisma.insuranceProvider.findUnique({
            where: { name },
        });
    }
    async createProvider(data) {
        return prisma.insuranceProvider.create({
            data: {
                name: data.name,
                phone: data.phone || null,
                email: data.email || null,
                address: data.address || null,
                defaultCoveragePercentage: data.defaultCoveragePercentage ?? 80.0,
                notes: data.notes || null,
                isActive: true,
            },
        });
    }
    async updateProvider(id, data) {
        return prisma.insuranceProvider.update({
            where: { id },
            data,
        });
    }
    async findCustomerInsurances(customerId) {
        return prisma.customerInsurance.findMany({
            where: { customerId, isActive: true },
            include: {
                insuranceProvider: true,
            },
        });
    }
    async findCustomerInsuranceById(id) {
        return prisma.customerInsurance.findUnique({
            where: { id },
            include: {
                insuranceProvider: true,
            },
        });
    }
    async createCustomerInsurance(data) {
        return prisma.customerInsurance.create({
            data: {
                customerId: data.customerId,
                insuranceProviderId: data.insuranceProviderId,
                policyNumber: data.policyNumber,
                memberNumber: data.memberNumber,
                coveragePercentage: data.coveragePercentage,
                maxCoverageLimit: data.maxCoverageLimit || null,
                expiryDate: data.expiryDate || null,
                isActive: true,
            },
            include: {
                insuranceProvider: true,
            },
        });
    }
}
export const insuranceRepository = new InsuranceRepository();
//# sourceMappingURL=insurance.repository.js.map