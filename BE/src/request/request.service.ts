import { requests } from '../models/dummy1.model';
import { InboxRequest } from '@droxi/shared';

export class RequestService {
    constructor() {}

    getAllRequests(): InboxRequest[] {
        return requests;
    }

    getRequestById(id: string): InboxRequest | undefined {
        return requests.find((req) => req.id === id);
    }
}
