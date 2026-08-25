import { IWhatsAppProvider, WhatsAppSendResult } from './whatsapp.types.js';

export class MockWhatsAppProvider implements IWhatsAppProvider {
  private shouldFailNext = false;

  setShouldFail(fail: boolean) {
    this.shouldFailNext = fail;
  }

  async sendMessage(phone: string, message: string): Promise<WhatsAppSendResult> {
    // Check if failure is simulated
    if (this.shouldFailNext || process.env.WHATSAPP_SIMULATE_FAILURE === 'true') {
      return {
        success: false,
        errorMessage: 'Network timeout or invalid destination phone number (simulated)',
      };
    }

    // Simulate successful dispatch
    const providerMessageId = `wamid.mock.${Date.now()}.${Math.random().toString(36).substring(2, 9)}`;
    return {
      success: true,
      providerMessageId,
    };
  }
}

export const defaultWhatsAppProvider = new MockWhatsAppProvider();
