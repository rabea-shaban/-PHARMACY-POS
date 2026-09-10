import { transfersService } from './transfers.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class TransfersController {
    service;
    constructor(service = transfersService) {
        this.service = service;
    }
    getTransfers = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getTransfers(filters);
            sendSuccess(res, 'Transfers retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getTransferById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const transfer = await this.service.getTransferById(id);
            sendSuccess(res, 'Transfer retrieved successfully', transfer, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createTransfer = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const transfer = await this.service.createTransfer(req.body, actorId);
            sendSuccess(res, 'Transfer request created successfully', transfer, 201);
        }
        catch (error) {
            next(error);
        }
    };
    approveTransfer = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const transfer = await this.service.approveTransfer(id, actorId);
            sendSuccess(res, 'Transfer request approved successfully', transfer, 200);
        }
        catch (error) {
            next(error);
        }
    };
    dispatchTransfer = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const transfer = await this.service.dispatchTransfer(id, actorId);
            sendSuccess(res, 'Transfer items dispatched successfully', transfer, 200);
        }
        catch (error) {
            next(error);
        }
    };
    receiveTransfer = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const transfer = await this.service.receiveTransfer(id, actorId);
            sendSuccess(res, 'Transfer items received and stocked successfully', transfer, 200);
        }
        catch (error) {
            next(error);
        }
    };
    rejectTransfer = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const transfer = await this.service.rejectTransfer(id, req.body, actorId);
            sendSuccess(res, 'Transfer request rejected successfully', transfer, 200);
        }
        catch (error) {
            next(error);
        }
    };
    cancelTransfer = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const transfer = await this.service.cancelTransfer(id, actorId);
            sendSuccess(res, 'Transfer request cancelled successfully', transfer, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const transfersController = new TransfersController();
//# sourceMappingURL=transfers.controller.js.map