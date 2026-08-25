import React from 'react';
import { Badge } from '../../../components/ui/Badge.js';
import { useTranslation } from 'react-i18next';
import { PurchaseStatus } from '../types/purchase.types.js';

export interface PurchaseStatusBadgeProps {
  status: PurchaseStatus;
}

export const PurchaseStatusBadge: React.FC<PurchaseStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation();

  switch (status) {
    case 'RECEIVED':
      return <Badge variant="success">{t('purchases.statusReceived')}</Badge>;
    case 'PENDING':
      return <Badge variant="warning">{t('purchases.statusPending')}</Badge>;
    case 'PAID':
      return <Badge variant="info">{t('purchases.statusPaid')}</Badge>;
    case 'PARTIALLY_PAID':
      return <Badge variant="purple">{t('purchases.statusPartiallyPaid')}</Badge>;
    case 'CANCELLED':
      return <Badge variant="danger">{t('purchases.statusCancelled')}</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};
