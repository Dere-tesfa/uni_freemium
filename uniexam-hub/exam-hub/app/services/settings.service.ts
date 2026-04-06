// Settings Service
// Server-side only - handles admin configuration and settings

import { db } from '../lib/db';
import type { Setting } from '../lib/types';

class SettingsService {
  /**
   * Get all settings (admin only)
   */
  async getAllSettings(): Promise<Setting[]> {
    return await db.getAllSettings();
  }

  /**
   * Get setting by key
   */
  async getSetting(key: string): Promise<Setting | null> {
    const setting = await db.getSetting(key);
    return setting || null;
  }

  /**
   * Get setting value by key
   */
  async getSettingValue(key: string): Promise<string | null> {
    const setting = await db.getSetting(key);
    return setting?.value || null;
  }

  /**
   * Update or create setting (admin only)
   */
  async upsertSetting(
    key: string,
    value: string,
    description?: string
  ): Promise<Setting> {
    const setting: Setting = {
      key,
      value,
      description,
      updated_at: new Date(),
    };

    return await db.upsertSetting(setting);
  }

  /**
   * Get bank account settings for payment display
   */
  async getBankAccounts(): Promise<Array<{
    name: string;
    account_number: string;
    description?: string;
  }>> {
    const settings = await db.getAllSettings();
    
    const bankSettings = settings.filter(s => 
      s.key.startsWith('bank_account_') || s.key === 'telebirr_number'
    );

    return bankSettings.map(s => ({
      name: this.formatBankName(s.key),
      account_number: s.value,
      description: s.description,
    }));
  }

  /**
   * Update bank account (admin only)
   */
  async updateBankAccount(
    bankKey: string,
    accountNumber: string,
    description?: string
  ): Promise<Setting> {
    // Validate bank key format
    if (!bankKey.startsWith('bank_account_') && bankKey !== 'telebirr_number') {
      throw new Error('Invalid bank key format. Must start with "bank_account_" or be "telebirr_number"');
    }

    return await this.upsertSetting(bankKey, accountNumber, description);
  }

  /**
   * Get payment instructions
   */
  async getPaymentInstructions(): Promise<string> {
    const instructions = await this.getSettingValue('payment_instructions');
    return instructions || this.getDefaultPaymentInstructions();
  }

  /**
   * Update payment instructions (admin only)
   */
  async updatePaymentInstructions(instructions: string): Promise<Setting> {
    return await this.upsertSetting(
      'payment_instructions',
      instructions,
      'Instructions shown to users during payment'
    );
  }

  /**
   * Get app configuration
   */
  async getAppConfig(): Promise<{
    app_name: string;
    support_email?: string;
    support_phone?: string;
    maintenance_mode: boolean;
    registration_enabled: boolean;
  }> {
    const appName = await this.getSettingValue('app_name') || 'UniExam Hub';
    const supportEmail = await this.getSettingValue('support_email');
    const supportPhone = await this.getSettingValue('support_phone');
    const maintenanceMode = await this.getSettingValue('maintenance_mode') === 'true';
    const registrationEnabled = await this.getSettingValue('registration_enabled') !== 'false';

    return {
      app_name: appName,
      support_email: supportEmail || undefined,
      support_phone: supportPhone || undefined,
      maintenance_mode: maintenanceMode,
      registration_enabled: registrationEnabled,
    };
  }

  /**
   * Update app configuration (admin only)
   */
  async updateAppConfig(config: {
    app_name?: string;
    support_email?: string;
    support_phone?: string;
    maintenance_mode?: boolean;
    registration_enabled?: boolean;
  }): Promise<void> {
    const updates: Promise<Setting>[] = [];

    if (config.app_name !== undefined) {
      updates.push(this.upsertSetting('app_name', config.app_name, 'Application name'));
    }

    if (config.support_email !== undefined) {
      updates.push(this.upsertSetting('support_email', config.support_email, 'Support email address'));
    }

    if (config.support_phone !== undefined) {
      updates.push(this.upsertSetting('support_phone', config.support_phone, 'Support phone number'));
    }

    if (config.maintenance_mode !== undefined) {
      updates.push(this.upsertSetting(
        'maintenance_mode',
        config.maintenance_mode.toString(),
        'Enable maintenance mode'
      ));
    }

    if (config.registration_enabled !== undefined) {
      updates.push(this.upsertSetting(
        'registration_enabled',
        config.registration_enabled.toString(),
        'Enable user registration'
      ));
    }

    await Promise.all(updates);
  }

  /**
   * Get feature flags
   */
  async getFeatureFlags(): Promise<{
    dark_mode_enabled: boolean;
    offline_mode_enabled: boolean;
    bookmarks_enabled: boolean;
    leaderboard_enabled: boolean;
    telegram_notifications: boolean;
  }> {
    const darkMode = await this.getSettingValue('feature_dark_mode') !== 'false';
    const offlineMode = await this.getSettingValue('feature_offline_mode') !== 'false';
    const bookmarks = await this.getSettingValue('feature_bookmarks') !== 'false';
    const leaderboard = await this.getSettingValue('feature_leaderboard') !== 'false';
    const telegram = await this.getSettingValue('feature_telegram') === 'true';

    return {
      dark_mode_enabled: darkMode,
      offline_mode_enabled: offlineMode,
      bookmarks_enabled: bookmarks,
      leaderboard_enabled: leaderboard,
      telegram_notifications: telegram,
    };
  }

  /**
   * Update feature flags (admin only)
   */
  async updateFeatureFlags(flags: {
    dark_mode_enabled?: boolean;
    offline_mode_enabled?: boolean;
    bookmarks_enabled?: boolean;
    leaderboard_enabled?: boolean;
    telegram_notifications?: boolean;
  }): Promise<void> {
    const updates: Promise<Setting>[] = [];

    if (flags.dark_mode_enabled !== undefined) {
      updates.push(this.upsertSetting(
        'feature_dark_mode',
        flags.dark_mode_enabled.toString(),
        'Enable dark mode feature'
      ));
    }

    if (flags.offline_mode_enabled !== undefined) {
      updates.push(this.upsertSetting(
        'feature_offline_mode',
        flags.offline_mode_enabled.toString(),
        'Enable offline mode (PWA)'
      ));
    }

    if (flags.bookmarks_enabled !== undefined) {
      updates.push(this.upsertSetting(
        'feature_bookmarks',
        flags.bookmarks_enabled.toString(),
        'Enable question bookmarks'
      ));
    }

    if (flags.leaderboard_enabled !== undefined) {
      updates.push(this.upsertSetting(
        'feature_leaderboard',
        flags.leaderboard_enabled.toString(),
        'Enable leaderboard'
      ));
    }

    if (flags.telegram_notifications !== undefined) {
      updates.push(this.upsertSetting(
        'feature_telegram',
        flags.telegram_notifications.toString(),
        'Enable Telegram notifications'
      ));
    }

    await Promise.all(updates);
  }

  /**
   * Get pricing configuration
   */
  async getPricingConfig(): Promise<{
    currency: string;
    min_price: number;
    max_price: number;
    default_price: number;
  }> {
    const currency = await this.getSettingValue('currency') || 'ETB';
    const minPrice = parseInt(await this.getSettingValue('min_price') || '0');
    const maxPrice = parseInt(await this.getSettingValue('max_price') || '1000');
    const defaultPrice = parseInt(await this.getSettingValue('default_price') || '50');

    return {
      currency,
      min_price: minPrice,
      max_price: maxPrice,
      default_price: defaultPrice,
    };
  }

  /**
   * Update pricing configuration (admin only)
   */
  async updatePricingConfig(config: {
    currency?: string;
    min_price?: number;
    max_price?: number;
    default_price?: number;
  }): Promise<void> {
    const updates: Promise<Setting>[] = [];

    if (config.currency !== undefined) {
      updates.push(this.upsertSetting('currency', config.currency, 'Currency code'));
    }

    if (config.min_price !== undefined) {
      updates.push(this.upsertSetting(
        'min_price',
        config.min_price.toString(),
        'Minimum sheet price'
      ));
    }

    if (config.max_price !== undefined) {
      updates.push(this.upsertSetting(
        'max_price',
        config.max_price.toString(),
        'Maximum sheet price'
      ));
    }

    if (config.default_price !== undefined) {
      updates.push(this.upsertSetting(
        'default_price',
        config.default_price.toString(),
        'Default sheet price'
      ));
    }

    await Promise.all(updates);
  }

  /**
   * Export all settings as JSON (admin only)
   */
  async exportSettings(): Promise<string> {
    const settings = await db.getAllSettings();
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.value,
        description: setting.description,
        updated_at: setting.updated_at,
      };
      return acc;
    }, {} as Record<string, any>);

    return JSON.stringify(settingsObj, null, 2);
  }

  /**
   * Import settings from JSON (admin only)
   */
  async importSettings(jsonData: string): Promise<{
    imported: number;
    failed: number;
    errors: string[];
  }> {
    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    try {
      const settingsObj = JSON.parse(jsonData);

      for (const [key, data] of Object.entries(settingsObj)) {
        try {
          const { value, description } = data as any;
          await this.upsertSetting(key, value, description);
          imported++;
        } catch (error) {
          failed++;
          errors.push(`${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      errors.push(`JSON parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      failed++;
    }

    return { imported, failed, errors };
  }

  /**
   * Reset settings to defaults (admin only)
   */
  async resetToDefaults(): Promise<void> {
    // Reset to default bank accounts
    await this.upsertSetting(
      'bank_account_cbe',
      '1000123456789',
      'Commercial Bank of Ethiopia Account'
    );
    await this.upsertSetting(
      'bank_account_awash',
      '01234567890123',
      'Awash Bank Account'
    );
    await this.upsertSetting(
      'telebirr_number',
      '+251912345678',
      'Telebirr Payment Number'
    );

    // Reset app config
    await this.updateAppConfig({
      app_name: 'UniExam Hub',
      maintenance_mode: false,
      registration_enabled: true,
    });

    // Reset feature flags
    await this.updateFeatureFlags({
      dark_mode_enabled: true,
      offline_mode_enabled: true,
      bookmarks_enabled: true,
      leaderboard_enabled: true,
      telegram_notifications: false,
    });

    // Reset pricing
    await this.updatePricingConfig({
      currency: 'ETB',
      min_price: 0,
      max_price: 1000,
      default_price: 50,
    });
  }

  /**
   * Format bank name from key
   */
  private formatBankName(key: string): string {
    if (key === 'telebirr_number') return 'Telebirr';
    
    const name = key.replace('bank_account_', '');
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get default payment instructions
   */
  private getDefaultPaymentInstructions(): string {
    return `
1. Transfer the exact amount to one of the bank accounts shown below
2. Take a screenshot of the successful transaction
3. Upload the screenshot using the form below
4. Wait for admin approval (usually within 24 hours)
5. You will receive a notification once your payment is approved
    `.trim();
  }
}

// Export singleton instance
export const settingsService = new SettingsService();
