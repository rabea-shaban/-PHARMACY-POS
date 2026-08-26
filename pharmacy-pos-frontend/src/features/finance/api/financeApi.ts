import { api } from '../../../lib/api.js';
import { ApiResponse } from '../../../types/api.types.js';
import { FinancialSummaryResponse, FinancialSummaryQueryParams } from '../types/finance.types.js';

export const financeApi = {
  // Get authoritative executive financial summary from reports module
  getFinancialSummary: async (
    params?: FinancialSummaryQueryParams
  ): Promise<FinancialSummaryResponse> => {
    const response = await api.get<ApiResponse<FinancialSummaryResponse>>(
      '/reports/financial-summary',
      { params }
    );
    return response.data.data;
  },
};
