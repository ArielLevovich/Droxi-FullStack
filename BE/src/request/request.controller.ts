import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import { RequestService } from './request.service';

export class RequestController implements Controller {
    path = '/requests';
    router = Router();
    private requestService = new RequestService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllRequests.bind(this));
        this.router.get(`${this.path}/:id`, this.getRequestById.bind(this));
    }

    private getAllRequests(req: Request, res: Response) {
        const requests = this.requestService.getAllRequests();
        res.json(requests);
    }

    private getRequestById(req: Request, res: Response) {
        const { id } = req.params;
        const request = this.requestService.getRequestById(id);
        if (request) {
            res.json(request);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    }
}
