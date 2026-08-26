import { IWhatsAppProvider, WhatsAppSendResult } from './whatsapp.types.js';
export declare class MockWhatsAppProvider implements IWhatsAppProvider {
    private shouldFailNext;
    setShouldFail(fail: boolean): void;
    sendMessage(phone: string, message: string): Promise<WhatsAppSendResult>;
}
export declare const defaultWhatsAppProvider: MockWhatsAppProvider;
