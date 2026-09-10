export type MedicationType = 'ACUTE' | 'CHRONIC';

export interface PatientMedication {
  id: string;
  customerId: string;
  productId: string;
  saleId?: string | null;
  prescribedById: string;
  type: MedicationType;
  dosage: string;
  dosageUnit?: string | null;
  frequency: string;
  dosageTimes?: string | null;
  dosageTimesList?: string[];
  duration?: string | null;
  isContinuous: boolean;
  doctorNotes?: string | null;
  startDate: string;
  endDate?: string | null;
  reviewDate?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    chronicDiseases?: string | null;
    allergies?: string | null;
  };
  product: {
    id: string;
    name: string;
    scientificName?: string | null;
    barcode?: string | null;
    category?: {
      id: string;
      name: string;
    };
  };
  prescribedBy: {
    id: string;
    name: string;
    role: string;
  };
  sale?: {
    id: string;
    invoiceNumber: string;
    createdAt: string;
  } | null;
}

export interface CustomerMedicationsResponse {
  all: PatientMedication[];
  active: PatientMedication[];
  chronic: PatientMedication[];
  acute: PatientMedication[];
  history: PatientMedication[];
  totalCount: number;
  activeCount: number;
  chronicCount: number;
}

export interface CreatePatientMedicationPayload {
  customerId: string;
  productId: string;
  saleId?: string | null;
  type: MedicationType;
  dosage: string;
  dosageUnit?: string | null;
  frequency: string;
  dosageTimes?: string | string[] | null;
  duration?: string | null;
  isContinuous?: boolean;
  doctorNotes?: string | null;
  startDate?: string;
  endDate?: string | null;
  reviewDate?: string | null;
  isActive?: boolean;
}

export interface PatientMedicationQueryParams {
  page?: number;
  limit?: number;
  customerId?: string;
  productId?: string;
  type?: MedicationType;
  isActive?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
