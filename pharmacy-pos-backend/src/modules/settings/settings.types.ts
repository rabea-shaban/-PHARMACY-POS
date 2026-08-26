export interface SystemSettingItem {
  id: string;
  key: string;
  value: string;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemSettingsMap {
  [key: string]: string;
}

export interface UpdateSettingsInput {
  settings: {
    key: string;
    value: string;
    description?: string;
    isPublic?: boolean;
  }[];
}

export interface PublicSettingsResponse {
  pharmacyName: string;
  pharmacyPhone: string;
  pharmacyAddress: string;
  pharmacyLogo?: string;
  pharmacySlogan?: string;
  pharmacyLicense?: string;
  pharmacyTaxNumber?: string;
  currency: string;
  taxRate: number;
  invoicePrefix: string;
}
