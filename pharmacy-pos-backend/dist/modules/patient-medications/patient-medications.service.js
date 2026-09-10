import { patientMedicationsRepository, } from './patient-medications.repository.js';
import { auditService } from '../audit/audit.service.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
function parseDosageTimes(val) {
    if (!val)
        return [];
    try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed))
            return parsed;
        return [String(parsed)];
    }
    catch {
        return val.split(',').map((s) => s.trim()).filter(Boolean);
    }
}
function formatPatientMedication(med) {
    return {
        ...med,
        dosageTimesList: parseDosageTimes(med.dosageTimes),
    };
}
export class PatientMedicationsService {
    repo;
    audit;
    constructor(repo = patientMedicationsRepository, audit = auditService) {
        this.repo = repo;
        this.audit = audit;
    }
    async getMedications(query) {
        const { medications, total } = await this.repo.findAll(query);
        return {
            items: medications.map(formatPatientMedication),
            pagination: getPaginationMeta(total, query.page, query.limit),
        };
    }
    async getMedicationById(id) {
        const med = await this.repo.findById(id);
        if (!med) {
            throw new NotFoundError(`Patient medication record with ID '${id}' not found`);
        }
        return formatPatientMedication(med);
    }
    async getCustomerMedications(customerId) {
        const list = await this.repo.findByCustomerId(customerId);
        const active = list.filter((m) => m.isActive);
        const chronic = list.filter((m) => m.type === 'CHRONIC' && m.isActive);
        const acute = list.filter((m) => m.type === 'ACUTE' && m.isActive);
        const history = list.filter((m) => !m.isActive);
        return {
            all: list.map(formatPatientMedication),
            active: active.map(formatPatientMedication),
            chronic: chronic.map(formatPatientMedication),
            acute: acute.map(formatPatientMedication),
            history: history.map(formatPatientMedication),
            totalCount: list.length,
            activeCount: active.length,
            chronicCount: chronic.length,
        };
    }
    async lookupPatientsByProduct(productId) {
        if (!productId) {
            throw new BadRequestError('Product ID is required');
        }
        const patients = await this.repo.findPatientsByProduct(productId);
        return patients;
    }
    async createMedication(data, prescribedById) {
        const created = await this.repo.create(data, prescribedById);
        await this.audit.logAction({
            userId: prescribedById,
            action: 'MEDICATION_CREATE',
            entity: 'PatientMedication',
            entityId: created.id,
            newData: {
                customerId: created.customerId,
                productId: created.productId,
                type: created.type,
                dosage: created.dosage,
                frequency: created.frequency,
            },
        });
        return formatPatientMedication(created);
    }
    async updateMedication(id, data, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Patient medication record with ID '${id}' not found`);
        }
        const updated = await this.repo.update(id, data);
        await this.audit.logAction({
            userId: actorId,
            action: 'MEDICATION_UPDATE',
            entity: 'PatientMedication',
            entityId: updated.id,
            oldData: {
                type: existing.type,
                dosage: existing.dosage,
                frequency: existing.frequency,
                isActive: existing.isActive,
            },
            newData: {
                type: updated.type,
                dosage: updated.dosage,
                frequency: updated.frequency,
                isActive: updated.isActive,
            },
        });
        return formatPatientMedication(updated);
    }
    async deactivateMedication(id, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Patient medication record with ID '${id}' not found`);
        }
        const deactivated = await this.repo.deactivate(id);
        await this.audit.logAction({
            userId: actorId,
            action: 'MEDICATION_DEACTIVATE',
            entity: 'PatientMedication',
            entityId: deactivated.id,
            oldData: { isActive: true },
            newData: { isActive: false },
        });
        return formatPatientMedication(deactivated);
    }
}
export const patientMedicationsService = new PatientMedicationsService();
//# sourceMappingURL=patient-medications.service.js.map