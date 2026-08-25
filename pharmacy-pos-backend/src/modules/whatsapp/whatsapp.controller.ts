import { Request, Response, NextFunction } from 'express';
import { whatsAppService, WhatsAppService } from './whatsapp.service.js';
import { sendSuccess } from '../../utils/response.util.js';
import { WhatsAppQueryDTO } from './whatsapp.validator.js';

export class WhatsAppController {
  constructor(private readonly service: WhatsAppService = whatsAppService) {}

  getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = req.query as unknown as WhatsAppQueryDTO;
      const result = await this.service.getMessages(filters);
      sendSuccess(res, 'WhatsApp messages retrieved successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  getMessageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.service.getMessageById(id);
      sendSuccess(res, 'WhatsApp message details retrieved', result, 200);
    } catch (error) {
      next(error);
    }
  };

  retryMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const actorId = req.user?.id as string;
      const result = await this.service.retryMessage(id, actorId);
      sendSuccess(res, 'WhatsApp message retry queued successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };
}

export const whatsAppController = new WhatsAppController();
