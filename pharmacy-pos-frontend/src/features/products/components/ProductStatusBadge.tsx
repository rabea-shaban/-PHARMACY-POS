import React from 'react';
import { Badge } from '../../../components/ui/Badge.js';
import { useTranslation } from 'react-i18next';

export interface ProductStatusBadgeProps {
  currentStock: number;
  minimumStock: number;
  isActive: boolean;
}

export const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({
  currentStock,
  minimumStock,
  isActive,
}) => {
  const { t } = useTranslation();

  if (!isActive) {
    return <Badge variant="neutral">{t('products.statusInactive')}</Badge>;
  }

  if (currentStock <= 0) {
    return <Badge variant="danger">{t('products.statusOutOfStock')}</Badge>;
  }

  if (currentStock <= minimumStock) {
    return <Badge variant="warning">{t('products.statusLowStock')}</Badge>;
  }

  return <Badge variant="success">{t('products.statusInStock')}</Badge>;
};
