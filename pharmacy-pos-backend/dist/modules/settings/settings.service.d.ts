import { SettingsRepository } from './settings.repository.js';
import { AuditService } from '../audit/audit.service.js';
import { SystemSettingItem, SystemSettingsMap, PublicSettingsResponse } from './settings.types.js';
import { UpdateSettingsDTO, UpdateSingleSettingDTO } from './settings.validator.js';
export declare class SettingsService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: SettingsRepository, audit?: AuditService);
    ensureDefaultSettings(): Promise<void>;
    getAllSettings(): Promise<{
        map: SystemSettingsMap;
        items: SystemSettingItem[];
    }>;
    getPublicSettings(): Promise<PublicSettingsResponse>;
    getSettingByKey(key: string): Promise<SystemSettingItem>;
    updateSettings(input: UpdateSettingsDTO, actorId: string): Promise<{
        items: SystemSettingItem[];
    }>;
    updateSingleSetting(key: string, input: UpdateSingleSettingDTO, actorId: string): Promise<SystemSettingItem>;
}
export declare const settingsService: SettingsService;
