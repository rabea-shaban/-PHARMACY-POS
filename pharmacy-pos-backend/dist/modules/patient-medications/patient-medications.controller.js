import { patientMedicationsService, } from './patient-medications.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class PatientMedicationsController {
    service;
    constructor(service = patientMedicationsService) {
        this.service = service;
    }
    getMedications = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getMedications(filters);
            sendSuccess(res, 'Patient medications retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getCustomerMedications = async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            const result = await this.service.getCustomerMedications(customerId);
            sendSuccess(res, 'Customer medications retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    lookupPatientsByProduct = async (req, res, next) => {
        try {
            const productId = req.query.productId;
            const result = await this.service.lookupPatientsByProduct(productId);
            sendSuccess(res, 'Patients taking product retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getMedicationById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const medication = await this.service.getMedicationById(id);
            sendSuccess(res, 'Patient medication retrieved successfully', medication, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createMedication = async (req, res, next) => {
        try {
            const prescribedById = req.user?.id || '';
            const medication = await this.service.createMedication(req.body, prescribedById);
            sendSuccess(res, 'Patient medication created successfully', medication, 201);
        }
        catch (error) {
            next(error);
        }
    };
    updateMedication = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const medication = await this.service.updateMedication(id, req.body, actorId);
            sendSuccess(res, 'Patient medication updated successfully', medication, 200);
        }
        catch (error) {
            next(error);
        }
    };
    deactivateMedication = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const medication = await this.service.deactivateMedication(id, actorId);
            sendSuccess(res, 'Patient medication deactivated successfully', medication, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const patientMedicationsController = new PatientMedicationsController();
//# sourceMappingURL=patient-medications.controller.js.map