import { Request, Response, NextFunction } from 'express';
import {
  patientMedicationsService,
  PatientMedicationsService,
} from './patient-medications.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { PatientMedicationQueryDTO } from './patient-medications.validator.js';

export class PatientMedicationsController {
  constructor(private readonly service: PatientMedicationsService = patientMedicationsService) {}

  getMedications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as PatientMedicationQueryDTO;
      const result = await this.service.getMedications(filters);
      sendSuccess(res, 'Patient medications retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getCustomerMedications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = req.params.customerId as string;
      const result = await this.service.getCustomerMedications(customerId);
      sendSuccess(res, 'Customer medications retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  lookupPatientsByProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.query.productId as string;
      const result = await this.service.lookupPatientsByProduct(productId);
      sendSuccess(res, 'Patients taking product retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getMedicationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const medication = await this.service.getMedicationById(id);
      sendSuccess(res, 'Patient medication retrieved successfully', medication, 200);
    } catch (error) {
      next(error);
    }
  };

  createMedication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const prescribedById = req.user?.id || '';
      const medication = await this.service.createMedication(req.body, prescribedById);
      sendSuccess(res, 'Patient medication created successfully', medication, 201);
    } catch (error) {
      next(error);
    }
  };

  updateMedication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const medication = await this.service.updateMedication(id, req.body, actorId);
      sendSuccess(res, 'Patient medication updated successfully', medication, 200);
    } catch (error) {
      next(error);
    }
  };

  deactivateMedication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id;
      const medication = await this.service.deactivateMedication(id, actorId);
      sendSuccess(res, 'Patient medication deactivated successfully', medication, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const patientMedicationsController = new PatientMedicationsController();
