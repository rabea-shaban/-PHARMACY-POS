import React from 'react';
import { Badge } from '../../../components/ui/Badge.js';
import { useTranslation } from 'react-i18next';

export interface InventoryStatusBadgeProps {
  status: 'HEALTHY' | 'LOW' | 'CRITICAL' | 'EXPIRED';
}

export const InventoryStatusBadge: React.FC<InventoryStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation();

  switch (status) {
    case 'HEALTHY':
      return <Badge variant="success">{t('inventory.statusHealthy')}</Badge>;
    case 'LOW':
      return <Badge variant="warning">{t('inventory.statusLow')}</Badge>;
    case 'CRITICAL':
      return <Badge variant="danger">{t('inventory.statusCritical')}</Badge>;
    case 'EXPIRED':
      return <Badge variant="danger">{t('inventory.statusExpired')}</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};
