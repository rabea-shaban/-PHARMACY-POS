import React from 'react';
import { Badge } from '../../../components/ui/Badge.js';
import { useTranslation } from 'react-i18next';

export interface SupplierStatusBadgeProps {
  isActive: boolean;
}

export const SupplierStatusBadge: React.FC<SupplierStatusBadgeProps> = ({ isActive }) => {
  const { t } = useTranslation();

  return (
    <Badge variant={isActive ? 'success' : 'neutral'}>
      {isActive ? t('suppliers.statusActive') : t('suppliers.statusInactive')}
    </Badge>
  );
};
