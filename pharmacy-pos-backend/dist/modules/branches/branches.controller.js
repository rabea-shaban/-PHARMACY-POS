import { branchesService } from './branches.service.js';
import { sendSuccess } from '../../utils/response.util.js';
export class BranchesController {
    service;
    constructor(service = branchesService) {
        this.service = service;
    }
    getBranches = async (req, res, next) => {
        try {
            const filters = req.query;
            const result = await this.service.getBranches(filters);
            sendSuccess(res, 'Branches retrieved successfully', result, 200);
        }
        catch (error) {
            next(error);
        }
    };
    getBranchById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const branch = await this.service.getBranchById(id);
            sendSuccess(res, 'Branch retrieved successfully', branch, 200);
        }
        catch (error) {
            next(error);
        }
    };
    createBranch = async (req, res, next) => {
        try {
            const actorId = req.user?.id;
            const branch = await this.service.createBranch(req.body, actorId);
            sendSuccess(res, 'Branch created successfully', branch, 201);
        }
        catch (error) {
            next(error);
        }
    };
    updateBranch = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const branch = await this.service.updateBranch(id, req.body, actorId);
            sendSuccess(res, 'Branch updated successfully', branch, 200);
        }
        catch (error) {
            next(error);
        }
    };
    deleteBranch = async (req, res, next) => {
        try {
            const id = req.params.id;
            const actorId = req.user?.id;
            const branch = await this.service.deleteBranch(id, actorId);
            sendSuccess(res, 'Branch deactivated successfully', branch, 200);
        }
        catch (error) {
            next(error);
        }
    };
}
export const branchesController = new BranchesController();
//# sourceMappingURL=branches.controller.js.map