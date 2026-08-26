import { Request, Response, NextFunction } from 'express';
import { WhatsAppService } from './whatsapp.service.js';
export declare class WhatsAppController {
    private readonly service;
    constructor(service?: WhatsAppService);
    getMessages: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMessageById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    retryMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const whatsAppController: WhatsAppController;
