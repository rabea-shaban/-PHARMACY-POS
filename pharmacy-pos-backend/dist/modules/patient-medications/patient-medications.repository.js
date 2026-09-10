import { prisma } from '../../lib/prisma.js';
export const patientMedicationIncludes = {
    customer: {
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
        },
    },
    product: {
        select: {
            id: true,
            name: true,
            scientificName: true,
            barcode: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
    prescribedBy: {
        select: {
            id: true,
            name: true,
            role: true,
        },
    },
    sale: {
        select: {
            id: true,
            invoiceNumber: true,
            createdAt: true,
        },
    },
};
export class PatientMedicationsRepository {
    async findAll(query = {}) {
        const page = Math.max(1, Number(query?.page) || 1);
        const limit = Math.max(1, Number(query?.limit) || 20);
        const skip = Math.max(0, (page - 1) * limit);
        const customerId = query?.customerId;
        const productId = query?.productId;
        const type = query?.type;
        const search = query?.search;
        const sortBy = query?.sortBy || 'createdAt';
        const sortOrder = query?.sortOrder || 'desc';
        const isActive = query?.isActive !== undefined
            ? typeof query.isActive === 'boolean'
                ? query.isActive
                : String(query.isActive) === 'true'
            : undefined;
        const where = {
            ...(customerId && { customerId }),
            ...(productId && { productId }),
            ...(type && { type }),
            ...(isActive !== undefined && { isActive }),
            ...(search && {
                OR: [
                    { dosage: { contains: search } },
                    { frequency: { contains: search } },
                    { doctorNotes: { contains: search } },
                    { product: { is: { name: { contains: search } } } },
                    { product: { is: { scientificName: { contains: search } } } },
                    { customer: { is: { name: { contains: search } } } },
                    { customer: { is: { phone: { contains: search } } } },
                ],
            }),
        };
        const [medications, total] = await Promise.all([
            prisma.patientMedication.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: patientMedicationIncludes,
            }),
            prisma.patientMedication.count({ where }),
        ]);
        return { medications, total };
    }
    async findById(id) {
        return prisma.patientMedication.findUnique({
            where: { id },
            include: patientMedicationIncludes,
        });
    }
    async findByCustomerId(customerId) {
        return prisma.patientMedication.findMany({
            where: { customerId },
            orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
            include: patientMedicationIncludes,
        });
    }
    async findPatientsByProduct(productId) {
        return prisma.patientMedication.findMany({
            where: { productId, isActive: true },
            distinct: ['customerId'],
            include: {
                customer: true,
                product: true,
            },
        });
    }
    async create(data, prescribedById) {
        const dosageTimesStr = Array.isArray(data.dosageTimes)
            ? JSON.stringify(data.dosageTimes)
            : data.dosageTimes || null;
        return prisma.patientMedication.create({
            data: {
                customerId: data.customerId,
                productId: data.productId,
                saleId: data.saleId,
                prescribedById,
                type: data.type,
                dosage: data.dosage,
                dosageUnit: data.dosageUnit,
                frequency: data.frequency,
                dosageTimes: dosageTimesStr,
                duration: data.duration,
                isContinuous: data.isContinuous ?? false,
                doctorNotes: data.doctorNotes,
                startDate: data.startDate || new Date(),
                endDate: data.endDate,
                reviewDate: data.reviewDate,
                isActive: data.isActive ?? true,
            },
            include: patientMedicationIncludes,
        });
    }
    async update(id, data) {
        const dosageTimesStr = data.dosageTimes !== undefined
            ? Array.isArray(data.dosageTimes)
                ? JSON.stringify(data.dosageTimes)
                : data.dosageTimes
            : undefined;
        return prisma.patientMedication.update({
            where: { id },
            data: {
                ...(data.type !== undefined && { type: data.type }),
                ...(data.dosage !== undefined && { dosage: data.dosage }),
                ...(data.dosageUnit !== undefined && { dosageUnit: data.dosageUnit }),
                ...(data.frequency !== undefined && { frequency: data.frequency }),
                ...(dosageTimesStr !== undefined && { dosageTimes: dosageTimesStr }),
                ...(data.duration !== undefined && { duration: data.duration }),
                ...(data.isContinuous !== undefined && { isContinuous: data.isContinuous }),
                ...(data.doctorNotes !== undefined && { doctorNotes: data.doctorNotes }),
                ...(data.startDate !== undefined && { startDate: data.startDate }),
                ...(data.endDate !== undefined && { endDate: data.endDate }),
                ...(data.reviewDate !== undefined && { reviewDate: data.reviewDate }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
            },
            include: patientMedicationIncludes,
        });
    }
    async deactivate(id) {
        return prisma.patientMedication.update({
            where: { id },
            data: {
                isActive: false,
                endDate: new Date(),
            },
            include: patientMedicationIncludes,
        });
    }
}
export const patientMedicationsRepository = new PatientMedicationsRepository();
//# sourceMappingURL=patient-medications.repository.js.map