import { Role } from '../types/auth.types.js';
import { MODULE_PERMISSIONS } from '../config/permissions.js';

export interface AppRouteDefinition {
  path: string;
  isProtected: boolean;
  allowedRoles?: Role[];
}

export const APP_ROUTES: Record<string, AppRouteDefinition> = {
  LOGIN: {
    path: '/login',
    isProtected: false,
  },
  DASHBOARD: {
    path: '/dashboard',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.dashboard,
  },
  POS: {
    path: '/pos',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.pos,
  },
  PRODUCTS: {
    path: '/products',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.products,
  },
  INVENTORY: {
    path: '/inventory',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.inventory,
  },
  PURCHASES: {
    path: '/purchases',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.purchases,
  },
  CUSTOMERS: {
    path: '/customers',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.customers,
  },
  SALES: {
    path: '/sales',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.sales,
  },
  RETURNS: {
    path: '/returns',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.returns,
  },
  EXPENSES: {
    path: '/expenses',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.expenses,
  },
  PAYROLL: {
    path: '/payroll',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.payroll,
  },
  REPORTS: {
    path: '/reports',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.reports,
  },
  NOTIFICATIONS: {
    path: '/notifications',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.notifications,
  },
  AUDIT: {
    path: '/audit',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.audit,
  },
  SETTINGS: {
    path: '/settings',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.settings,
  },
  USERS: {
    path: '/users',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.users,
  },
  FORBIDDEN: {
    path: '/forbidden',
    isProtected: true,
  },
};
