export declare class SettingsRepository {
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: string;
        key: string;
        isPublic: boolean;
    }[]>;
    findPublic(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: string;
        key: string;
        isPublic: boolean;
    }[]>;
    findByKey(key: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: string;
        key: string;
        isPublic: boolean;
    } | null>;
    upsertSetting(data: {
        key: string;
        value: string;
        description?: string;
        isPublic?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: string;
        key: string;
        isPublic: boolean;
    }>;
    upsertMany(settings: {
        key: string;
        value: string;
        description?: string;
        isPublic?: boolean;
    }[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: string;
        key: string;
        isPublic: boolean;
    }[]>;
}
export declare const settingsRepository: SettingsRepository;
