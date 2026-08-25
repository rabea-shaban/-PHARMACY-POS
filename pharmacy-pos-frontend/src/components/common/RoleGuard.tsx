import React from 'react';
import { useAppSelector } from '../../store/hooks.js';
import { Role } from '../../types/auth.types.js';
import { ForbiddenPage } from '../../pages/ForbiddenPage.js';

export interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback,
}) => {
  const { role } = useAppSelector((state) => state.auth);

  if (!role || !allowedRoles.includes(role)) {
    return <>{fallback || <ForbiddenPage />}</>;
  }

  return <>{children}</>;
};
