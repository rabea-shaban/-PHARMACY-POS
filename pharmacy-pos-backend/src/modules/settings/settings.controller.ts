import { Request, Response, NextFunction } from 'express';
import { settingsService, SettingsService } from './settings.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { UpdateSettingsDTO, UpdateSingleSettingDTO } from './settings.validator.js';

export class SettingsController {
  constructor(private readonly service: SettingsService = settingsService) {}

  getAllSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getAllSettings();
      sendSuccess(res, 'System settings retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getPublicSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getPublicSettings();
      sendSuccess(res, 'Public settings retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getSettingByKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = req.params.key as string;
      const result = await this.service.getSettingByKey(key);
      sendSuccess(res, `Setting '${key}' retrieved successfully`, result, 200);
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actorId = req.user?.id as string;
      const result = await this.service.updateSettings(req.body as UpdateSettingsDTO, actorId);
      sendSuccess(res, 'System settings updated successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  updateSingleSetting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = req.params.key as string;
      const actorId = req.user?.id as string;
      const result = await this.service.updateSingleSetting(key, req.body as UpdateSingleSettingDTO, actorId);
      sendSuccess(res, `Setting '${key}' updated successfully`, result, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const settingsController = new SettingsController();
