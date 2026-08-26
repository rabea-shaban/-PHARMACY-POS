import { settingsRepository, SettingsRepository } from './settings.repository.js';
import { auditService, AuditService } from '../audit/audit.service.js';
import {
  SystemSettingItem,
  SystemSettingsMap,
  PublicSettingsResponse,
} from './settings.types.js';
import { UpdateSettingsDTO, UpdateSingleSettingDTO } from './settings.validator.js';
import { NotFoundError } from '../../utils/errors.js';

const DEFAULT_SETTINGS = [
  { key: 'pharmacy_name', value: 'Al-Amal Modern Pharmacy', description: 'Official Pharmacy Name', isPublic: true },
  { key: 'pharmacy_phone', value: '+201000000000', description: 'Official Hotline / WhatsApp Contact', isPublic: true },
  { key: 'pharmacy_address', value: 'Cairo, Egypt', description: 'Physical Pharmacy Address', isPublic: true },
  { key: 'currency', value: 'EGP', description: 'Standard Currency Symbol', isPublic: true },
  { key: 'tax_rate', value: '0.00', description: 'Default Sales Tax Rate (%)', isPublic: true },
  { key: 'invoice_prefix', value: 'INV', description: 'Sales Invoice Number Prefix', isPublic: true },
  { key: 'low_stock_threshold', value: '10', description: 'Threshold for Low Stock Warning Alerts', isPublic: false },
  { key: 'expiry_alert_days', value: '90', description: 'Horizon for Expiring Batch Warning Alerts (Days)', isPublic: false },
  { key: 'loyalty_points_per_egp', value: '0.1', description: 'Loyalty Points Earned per 1 EGP Spent', isPublic: false },
  { key: 'loyalty_point_value', value: '0.1', description: 'Redemption Value of 1 Loyalty Point (EGP)', isPublic: false },
  { key: 'commission_default_rate', value: '5.0', description: 'Default Staff Commission Percentage (%)', isPublic: false },
];

export class SettingsService {
  constructor(
    private readonly repo: SettingsRepository = settingsRepository,
    private readonly audit: AuditService = auditService
  ) {}

  async ensureDefaultSettings(): Promise<void> {
    const existing = await this.repo.findAll();
    if (existing.length === 0) {
      await this.repo.upsertMany(DEFAULT_SETTINGS);
    }
  }

  async getAllSettings(): Promise<{ map: SystemSettingsMap; items: SystemSettingItem[] }> {
    await this.ensureDefaultSettings();
    const items = await this.repo.findAll();
    const map: SystemSettingsMap = {};
    for (const item of items) {
      map[item.key] = item.value;
    }
    return { map, items };
  }

  async getPublicSettings(): Promise<PublicSettingsResponse> {
    await this.ensureDefaultSettings();
    const publicItems = await this.repo.findPublic();
    const map = new Map<string, string>();
    for (const item of publicItems) {
      map.set(item.key, item.value);
    }

    return {
      pharmacyName: map.get('pharmacy_name') || 'Al-Amal Modern Pharmacy',
      pharmacyPhone: map.get('pharmacy_phone') || '+201000000000',
      pharmacyAddress: map.get('pharmacy_address') || 'Cairo, Egypt',
      pharmacyLogo: map.get('pharmacy_logo') || '',
      pharmacySlogan: map.get('pharmacy_slogan') || 'رعاية صحية متكاملة لأسرتك',
      pharmacyLicense: map.get('pharmacy_license') || '10482 / 2026',
      pharmacyTaxNumber: map.get('pharmacy_tax_number') || '300-123-456',
      currency: map.get('currency') || 'EGP',
      taxRate: Number(map.get('tax_rate') || 0),
      invoicePrefix: map.get('invoice_prefix') || 'INV',
    };
  }

  async getSettingByKey(key: string): Promise<SystemSettingItem> {
    const item = await this.repo.findByKey(key);
    if (!item) {
      throw new NotFoundError(`System setting '${key}' not found`);
    }
    return item;
  }

  async updateSettings(input: UpdateSettingsDTO, actorId: string): Promise<{ items: SystemSettingItem[] }> {
    const oldSettings = await this.repo.findAll();
    const oldMap: Record<string, string> = {};
    for (const s of oldSettings) oldMap[s.key] = s.value;

    const updated = await this.repo.upsertMany(input.settings);

    const newMap: Record<string, string> = {};
    for (const s of input.settings) newMap[s.key] = s.value;

    await this.audit.logAction({
      userId: actorId,
      action: 'UPDATE',
      entity: 'system_settings',
      oldData: oldMap,
      newData: newMap,
      metadata: { count: input.settings.length },
    });

    return { items: updated };
  }

  async updateSingleSetting(
    key: string,
    input: UpdateSingleSettingDTO,
    actorId: string
  ): Promise<SystemSettingItem> {
    const existing = await this.repo.findByKey(key);
    const updated = await this.repo.upsertSetting({
      key,
      value: input.value,
      description: input.description,
      isPublic: input.isPublic,
    });

    await this.audit.logAction({
      userId: actorId,
      action: 'UPDATE',
      entity: 'system_settings',
      entityId: key,
      oldData: existing ? { value: existing.value } : null,
      newData: { value: input.value },
    });

    return updated;
  }
}

export const settingsService = new SettingsService();
