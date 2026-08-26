import { whatsAppService } from './whatsapp.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class WhatsAppController {
    service;
    constructor(service = whatsAppService) {
        this.service = service;
    }
    getMessages = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getMessages(filters);
            sendSuccess(res, 'WhatsApp messages retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getMessageById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await this.service.getMessageById(id);
            sendSuccess(res, 'WhatsApp message details retrieved', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    retryMessage = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const result = await this.service.retryMessage(id, actorId);
            sendSuccess(res, 'WhatsApp message retry queued successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const whatsAppController = new WhatsAppController();
//# sourceMappingURL=whatsapp.controller.js.map