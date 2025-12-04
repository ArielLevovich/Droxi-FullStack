export type RequestType = 'renewal' | 'freeText' | 'labReport';

export interface InboxRequest {
  type: RequestType;
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
