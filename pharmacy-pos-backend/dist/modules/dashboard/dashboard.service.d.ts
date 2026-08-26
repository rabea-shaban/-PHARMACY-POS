import { DashboardRepository } from './dashboard.repository.js';
import { DashboardOverviewResponse } from './dashboard.types.js';
export declare class DashboardService {
    private readonly repo;
    constructor(repo?: DashboardRepository);
    getOverview(from?: string, to?: string): Promise<DashboardOverviewResponse>;
}
export declare const dashboardService: DashboardService;
