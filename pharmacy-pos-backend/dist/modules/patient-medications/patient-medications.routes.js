import { Router } from 'express';
import { patientMedicationsController } from './patient-medications.controller.js';
import { createPatientMedicationSchema, updatePatientMedicationSchema, patientMedicationQuerySchema, medicationIdParamSchema, customerIdParamSchema, } from './patient-medications.validator.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
export const patientMedicationsRouter = Router();
patientMedicationsRouter.use(authenticate);
// GET /api/v1/patient-medications - Query medications
patientMedicationsRouter.get('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateQuery(patientMedicationQuerySchema), patientMedicationsController.getMedications);
// GET /api/v1/patient-medications/lookup-patient - Find patients taking a specific drug
patientMedicationsRouter.get('/lookup-patient', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'), patientMedicationsController.lookupPatientsByProduct);
// GET /api/v1/patient-medications/customer/:customerId - Get all active/chronic/history meds for customer
patientMedicationsRouter.get('/customer/:customerId', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateParams(customerIdParamSchema), patientMedicationsController.getCustomerMedications);
// GET /api/v1/patient-medications/:id - Get specific medication
patientMedicationsRouter.get('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'), validateParams(medicationIdParamSchema), patientMedicationsController.getMedicationById);
// POST /api/v1/patient-medications - Create patient medication instruction
patientMedicationsRouter.post('/', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'), validateBody(createPatientMedicationSchema), patientMedicationsController.createMedication);
// PATCH /api/v1/patient-medications/:id - Update patient medication instruction
patientMedicationsRouter.patch('/:id', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'), validateParams(medicationIdParamSchema), validateBody(updatePatientMedicationSchema), patientMedicationsController.updateMedication);
// PATCH /api/v1/patient-medications/:id/deactivate - Deactivate medication
patientMedicationsRouter.patch('/:id/deactivate', authorize('PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'), validateParams(medicationIdParamSchema), patientMedicationsController.deactivateMedication);
//# sourceMappingURL=patient-medications.routes.js.map