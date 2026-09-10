import { PatientMedication } from '@prisma/client';
import { CreatePatientMedicationDTO, UpdatePatientMedicationDTO, PatientMedicationQueryDTO } from './patient-medications.validator.js';
export declare const patientMedicationIncludes: {
    customer: {
        select: {
            id: boolean;
            name: boolean;
            phone: boolean;
            email: boolean;
        };
    };
    product: {
        select: {
            id: boolean;
            name: boolean;
            scientificName: boolean;
            barcode: boolean;
            category: {
                select: {
                    id: boolean;
                    name: boolean;
                };
            };
        };
    };
    prescribedBy: {
        select: {
            id: boolean;
            name: boolean;
            role: boolean;
        };
    };
    sale: {
        select: {
            id: boolean;
            invoiceNumber: boolean;
            createdAt: boolean;
        };
    };
};
export declare class PatientMedicationsRepository {
    findAll(query?: PatientMedicationQueryDTO): Promise<{
        medications: any[];
        total: number;
    }>;
    findById(id: string): Promise<any | null>;
    findByCustomerId(customerId: string): Promise<any[]>;
    findPatientsByProduct(productId: string): Promise<any[]>;
    create(data: CreatePatientMedicationDTO, prescribedById: string): Promise<PatientMedication>;
    update(id: string, data: UpdatePatientMedicationDTO): Promise<PatientMedication>;
    deactivate(id: string): Promise<PatientMedication>;
}
export declare const patientMedicationsRepository: PatientMedicationsRepository;
