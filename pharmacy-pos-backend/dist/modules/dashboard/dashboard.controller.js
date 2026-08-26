import { dashboardService } from './dashboard.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class DashboardController {
    service;
    constructor(service = dashboardService) {
        this.service = service;
    }
    getOverview = async (req, res, next) => {
        try {
            const from = req.query.from;
            const to = req.query.to;
            const overview = await this.service.getOverview(from, to);
            sendSuccess(res, 'Dashboard overview retrieved successfully', overview, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const dashboardController = new DashboardController();
//# sourceMappingURL=dashboard.controller.js.map