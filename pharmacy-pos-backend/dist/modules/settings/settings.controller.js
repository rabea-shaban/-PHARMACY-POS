import { settingsService } from './settings.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class SettingsController {
    service;
    constructor(service = settingsService) {
        this.service = service;
    }
    getAllSettings = async (req, res, next) => {
        try {
            const result = await this.service.getAllSettings();
            sendSuccess(res, 'System settings retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getPublicSettings = async (req, res, next) => {
        try {
            const result = await this.service.getPublicSettings();
            sendSuccess(res, 'Public settings retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getSettingByKey = async (req, res, next) => {
        try {
            const key = req.params.key;
            const result = await this.service.getSettingByKey(key);
            sendSuccess(res, `Setting '${key}' retrieved successfully`, result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    updateSettings = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const result = await this.service.updateSettings(req.body, actorId);
            sendSuccess(res, 'System settings updated successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    updateSingleSetting = async (req, res, next) => {
        try {
            const key = req.params.key;
            const actorId = req.user?.id;
            const result = await this.service.updateSingleSetting(key, req.body, actorId);
            sendSuccess(res, `Setting '${key}' updated successfully`, result, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const settingsController = new SettingsController();
//# sourceMappingURL=settings.controller.js.map