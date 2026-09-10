import { api } from '../../../lib/api.js';
import { ApiResponse, PaginatedResponse } from '../../../types/api.types.js';
import {
  PatientMedication,
  CustomerMedicationsResponse,
  CreatePatientMedicationPayload,
  PatientMedicationQueryParams,
} from '../types/patientMedication.types.js';

export const patientMedicationsApi = {
  getMedications: async (params?: PatientMedicationQueryParams): Promise<PaginatedResponse<PatientMedication>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<PatientMedication>>>('/patient-medications', { params });
    return response.data.data;
  },

  getCustomerMedications: async (customerId: string): Promise<CustomerMedicationsResponse> => {
    const response = await api.get<ApiResponse<CustomerMedicationsResponse>>(`/patient-medications/customer/${customerId}`);
    return response.data.data;
  },

  lookupPatientsByProduct: async (productId: string): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>('/patient-medications/lookup-patient', {
      params: { productId },
    });
    return response.data.data;
  },

  getMedicationById: async (id: string): Promise<PatientMedication> => {
    const response = await api.get<ApiResponse<PatientMedication>>(`/patient-medications/${id}`);
    return response.data.data;
  },

  createMedication: async (data: CreatePatientMedicationPayload): Promise<PatientMedication> => {
    const response = await api.post<ApiResponse<PatientMedication>>('/patient-medications', data);
    return response.data.data;
  },

  updateMedication: async (id: string, data: Partial<CreatePatientMedicationPayload>): Promise<PatientMedication> => {
    const response = await api.patch<ApiResponse<PatientMedication>>(`/patient-medications/${id}`, data);
    return response.data.data;
  },

  deactivateMedication: async (id: string): Promise<PatientMedication> => {
    const response = await api.patch<ApiResponse<PatientMedication>>(`/patient-medications/${id}/deactivate`);
    return response.data.data;
  },
};
