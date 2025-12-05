import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RequestService } from './request.service';
import { InboxRequest } from '../models/inbox-request.interface';
import { environment } from '../../environments/environment';

describe('RequestService', () => {
  let service: RequestService;
  let httpMock: HttpTestingController;

  const mockRequests: InboxRequest[] = [
    {
      type: 'renewal',
      id: '1',
      status: 'new',
      isRead: false,
      patientName: 'John Smith',
      requestDate: '2025-06-08T00:00:00.000Z',
      lastModifiedDate: '2025-06-08T11:01:47.567Z',
      description: 'Refill request',
      estimatedTimeSec: 151,
      assignment: {
        assignDate: '2025-06-08T11:01:47.567Z',
        assignedTo: 'Dr. Johnson',
      },
      isUrgent: false,
    },
    {
      type: 'freeText',
      id: '2',
      status: 'new',
      isRead: true,
      patientName: 'Mary Davis',
      requestDate: '2025-06-08T00:00:00.000Z',
      lastModifiedDate: '2025-06-08T09:41:33.619Z',
      description: 'Response earlier',
      estimatedTimeSec: 167,
      assignment: {
        assignDate: '2025-06-08T09:41:33.619Z',
        assignedTo: 'Dr. Johnson',
      },
      isUrgent: false,
      labels: ['Rx'],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestService],
    });

    service = TestBed.inject(RequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllRequests', () => {
    it('should return all requests from the API', () => {
      service.getAllRequests().subscribe((requests) => {
        expect(requests).toEqual(mockRequests);
        expect(requests.length).toBe(2);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/requests`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRequests);
    });

    it('should return empty array when no requests exist', () => {
      service.getAllRequests().subscribe((requests) => {
        expect(requests).toEqual([]);
        expect(requests.length).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/requests`);
      req.flush([]);
    });

    it('should handle HTTP errors', () => {
      const errorMessage = 'Server error';

      service.getAllRequests().subscribe({
        next: () => { throw new Error('should have failed with server error'); },
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/requests`);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getRequestById', () => {
    it('should return a single request by ID', () => {
      const mockRequest = mockRequests[0];

      service.getRequestById('1').subscribe((request) => {
        expect(request).toEqual(mockRequest);
        expect(request.id).toBe('1');
        expect(request.patientName).toBe('John Smith');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/requests/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRequest);
    });

    it('should handle 404 when request not found', () => {
      service.getRequestById('999').subscribe({
        next: () => { throw new Error('should have failed with 404'); },
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/requests/999`);
      req.flush({ message: 'Request not found' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
