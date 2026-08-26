import { securityService } from './security.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class SecurityController {
    service;
    constructor(service = securityService) {
        this.service = service;
    }
    getLoginLogs = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getLoginLogs(filters);
            sendSuccess(res, 'Security login logs retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getStats = async (req, res, next) => {
        try {
            const query = req.query;
            const result = await this.service.getStats(query.from, query.to);
            sendSuccess(res, 'Security login statistics retrieved', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const securityController = new SecurityController();
//# sourceMappingURL=security.controller.js.map