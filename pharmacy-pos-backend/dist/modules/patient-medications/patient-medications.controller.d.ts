import { Request, Response, NextFunction } from 'express';
import { PatientMedicationsService } from './patient-medications.service.js';
export declare class PatientMedicationsController {
    private readonly service;
    constructor(service?: PatientMedicationsService);
    getMedications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCustomerMedications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    lookupPatientsByProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMedicationById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createMedication: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateMedication: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deactivateMedication: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const patientMedicationsController: PatientMedicationsController;
