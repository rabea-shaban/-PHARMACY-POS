export interface Discount {
  id: string;
  code?: string | null;
  name: string;
  type: 'PERCENTAGE' | 'FIXED' | 'PROMOTIONAL' | 'CUSTOMER_TIER' | 'MANUAL';
  value: number;
  minimumPurchase: number;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
}
