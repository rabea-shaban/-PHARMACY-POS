import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service.js';
export declare class SettingsController {
    private readonly service;
    constructor(service?: SettingsService);
    getAllSettings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPublicSettings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSettingByKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateSettings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateSingleSetting: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const settingsController: SettingsController;
