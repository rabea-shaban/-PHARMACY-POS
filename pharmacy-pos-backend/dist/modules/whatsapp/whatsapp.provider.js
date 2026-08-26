export class MockWhatsAppProvider {
    shouldFailNext = false;
    setShouldFail(fail) {
        this.shouldFailNext = fail;
    }
    async sendMessage(phone, message) {
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
//# sourceMappingURL=whatsapp.provider.js.map