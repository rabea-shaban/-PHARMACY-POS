import { Role } from '../types/auth.types.js';

export const APP_ROLES: Record<Role, Role> = {
  PLATFORM_MANAGER: 'PLATFORM_MANAGER',
  PHARMACY_MANAGER: 'PHARMACY_MANAGER',
  PHARMACIST: 'PHARMACIST',
  ACCOUNTANT: 'ACCOUNTANT',
};

// Module access matrix
export const MODULE_PERMISSIONS = {
  pos: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'] as Role[],
  dashboard: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'] as Role[],
  products: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'] as Role[],
  inventory: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'] as Role[],
  purchases: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'] as Role[],
  customers: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'] as Role[],
  sales: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'] as Role[],
  returns: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'] as Role[],
  expenses: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'] as Role[],
  finance: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'] as Role[],
  payments: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT', 'PHARMACIST'] as Role[],
  payroll: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'] as Role[],
  commissions: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT', 'PHARMACIST'] as Role[],
  reports: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'] as Role[],
  notifications: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'] as Role[],
  audit: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'] as Role[],
  settings: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'] as Role[],
  users: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'] as Role[],
} as const;

// Default redirect path based on user role
export function getDefaultRouteForRole(role: Role | null | undefined): string {
  if (!role) return '/login';
  switch (role) {
    case 'PHARMACIST':
      return '/pos';
    case 'PLATFORM_MANAGER':
    case 'PHARMACY_MANAGER':
    case 'ACCOUNTANT':
    default:
      return '/dashboard';
  }
}

// Check if user has permission to access a module
export function canAccessModule(userRole: Role | null | undefined, allowedRoles: Role[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}
