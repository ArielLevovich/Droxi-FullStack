import { requests } from '../models/dummy1.model';

export interface InboxRequest {
    type: 'renewal' | 'freeText' | 'labReport';
    id: string;
    status: string;
    isRead: boolean;
    patientName: string;
    requestDate: string;
    lastModifiedDate: string;
    description: string;
    estimatedTimeSec: number;
    assignment: {
        assignDate: string;
        assignedTo: string;
        grouping?: string;
    };
    isUrgent: boolean;
    labels?: string[];
    panels?: string[];
    abnormalResults?: string[];
    prescriptionIds?: string[];
    recommendation?: {
        recommendationValue: string;
        recommendationDescription: string;
    };
}

export class RequestService {
    constructor() {}

    getAllRequests(): InboxRequest[] {
        return requests as InboxRequest[];
    }

    getRequestById(id: string): InboxRequest | undefined {
        return (requests as InboxRequest[]).find((req) => req.id === id);
    }
}
