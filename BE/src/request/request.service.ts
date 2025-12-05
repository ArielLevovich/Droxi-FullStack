import { requests } from '../models/dummy1.model';
import { InboxRequest } from '@droxi/shared';

export class RequestService {
    constructor() {}

    getAllRequests(): InboxRequest[] {
        return requests as InboxRequest[];
    }

    getRequestById(id: string): InboxRequest | undefined {
        return (requests as InboxRequest[]).find((req) => req.id === id);
    }
}
