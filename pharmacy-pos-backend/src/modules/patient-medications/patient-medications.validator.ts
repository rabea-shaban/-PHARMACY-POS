import { z } from 'zod';

export const medicationIdParamSchema = z.object({
  id: z.string().uuid('Medication ID must be a valid UUID'),
});

export const customerIdParamSchema = z.object({
  customerId: z.string().uuid('Customer ID must be a valid UUID'),
});

export const createPatientMedicationSchema = z.object({
  customerId: z.string().uuid('Customer ID must be a valid UUID'),
  productId: z.string().uuid('Product ID must be a valid UUID'),
  saleId: z.string().uuid().optional().nullable(),
  type: z.enum(['ACUTE', 'CHRONIC']).default('ACUTE'),
  dosage: z.string().trim().min(1, 'Dosage is required (e.g. 1 قرص / 1 tablet)'),
  dosageUnit: z.string().trim().max(50).optional().nullable(),
  frequency: z.string().trim().min(1, 'Frequency is required (e.g. كل 8 ساعات / Twice daily)'),
  dosageTimes: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return null;
      if (Array.isArray(val)) return JSON.stringify(val);
      return val;
    }),
  duration: z.string().trim().max(100).optional().nullable(),
  isContinuous: z.boolean().optional().default(false),
  doctorNotes: z.string().trim().max(1000).optional().nullable(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional().nullable(),
  reviewDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const updatePatientMedicationSchema = z.object({
  type: z.enum(['ACUTE', 'CHRONIC']).optional(),
  dosage: z.string().trim().min(1).optional(),
  dosageUnit: z.string().trim().max(50).optional().nullable(),
  frequency: z.string().trim().min(1).optional(),
  dosageTimes: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return null;
      if (Array.isArray(val)) return JSON.stringify(val);
      return val;
    }),
  duration: z.string().trim().max(100).optional().nullable(),
  isContinuous: z.boolean().optional(),
  doctorNotes: z.string().trim().max(1000).optional().nullable(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional().nullable(),
  reviewDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const patientMedicationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  customerId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  type: z.enum(['ACUTE', 'CHRONIC']).optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(['createdAt', 'startDate', 'endDate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreatePatientMedicationDTO = z.infer<typeof createPatientMedicationSchema>;
export type UpdatePatientMedicationDTO = z.infer<typeof updatePatientMedicationSchema>;
export type PatientMedicationQueryDTO = z.infer<typeof patientMedicationQuerySchema>;
