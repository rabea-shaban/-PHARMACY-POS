import { PatientMedicationsRepository } from './patient-medications.repository.js';
import { CreatePatientMedicationDTO, UpdatePatientMedicationDTO, PatientMedicationQueryDTO } from './patient-medications.validator.js';
import { AuditService } from '../audit/audit.service.js';
import { PatientMedication } from '@prisma/client';
export declare class PatientMedicationsService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: PatientMedicationsRepository, audit?: AuditService);
    getMedications(query: PatientMedicationQueryDTO): Promise<{
        items: any[];
        pagination: import("../../types/common.types.js").PaginationMeta;
    }>;
    getMedicationById(id: string): Promise<any>;
    getCustomerMedications(customerId: string): Promise<{
        all: any[];
        active: any[];
        chronic: any[];
        acute: any[];
        history: any[];
        totalCount: number;
        activeCount: number;
        chronicCount: number;
    }>;
    lookupPatientsByProduct(productId: string): Promise<any[]>;
    createMedication(data: CreatePatientMedicationDTO, prescribedById: string): Promise<PatientMedication>;
    updateMedication(id: string, data: UpdatePatientMedicationDTO, actorId?: string): Promise<PatientMedication>;
    deactivateMedication(id: string, actorId?: string): Promise<PatientMedication>;
}
export declare const patientMedicationsService: PatientMedicationsService;
