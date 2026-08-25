export interface Category {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface CategoryFormValues {
  name: string;
  description?: string | null;
  isActive?: boolean;
}
