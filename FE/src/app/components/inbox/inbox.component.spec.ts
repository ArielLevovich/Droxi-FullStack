import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { InboxComponent } from './inbox.component';
import { RequestService } from '../../services/request.service';
import { InboxRequest } from '../../models/inbox-request.interface';

describe('InboxComponent', () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;
  let requestServiceSpy: jasmine.SpyObj<RequestService>;

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

  beforeEach(async () => {
    requestServiceSpy = jasmine.createSpyObj('RequestService', ['getAllRequests']);

    await TestBed.configureTestingModule({
      imports: [InboxComponent, HttpClientTestingModule],
      providers: [{ provide: RequestService, useValue: requestServiceSpy }],
    }).compileComponents();
  });

  describe('Loading state', () => {
    it('should show loading state initially', () => {
      requestServiceSpy.getAllRequests.and.returnValue(of([]));
      fixture = TestBed.createComponent(InboxComponent);
      component = fixture.componentInstance;

      expect(component.loading).toBe(true);
      expect(component.error).toBeNull();
      expect(component.requests).toEqual([]);
    });

    it('should display loading message in template', () => {
      requestServiceSpy.getAllRequests.and.returnValue(of([]));
      fixture = TestBed.createComponent(InboxComponent);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.loading')?.textContent).toContain('Loading requests...');
    });
  });

  describe('Successful data loading', () => {
    beforeEach(() => {
      requestServiceSpy.getAllRequests.and.returnValue(of(mockRequests));
      fixture = TestBed.createComponent(InboxComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should load requests on init', () => {
      expect(component.requests).toEqual(mockRequests);
      expect(component.requests.length).toBe(2);
    });

    it('should set loading to false after data loads', () => {
      expect(component.loading).toBe(false);
    });

    it('should not have error after successful load', () => {
      expect(component.error).toBeNull();
    });

    it('should set lastSyncTime after successful load', () => {
      expect(component.lastSyncTime).toBeTruthy();
      expect(component.lastSyncTime instanceof Date).toBe(true);
    });

    it('should display sync time as "Just now" immediately after load', () => {
      expect(component.syncTimeDisplay).toBe('Just now');
    });

    it('should render request items', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const requestItems = compiled.querySelectorAll('app-request-item');
      expect(requestItems.length).toBe(2);
    });

    it('should not show loading or error messages', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.loading')).toBeNull();
      expect(compiled.querySelector('.error')).toBeNull();
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      requestServiceSpy.getAllRequests.and.returnValue(throwError(() => new Error('Network error')));
      fixture = TestBed.createComponent(InboxComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should set error message on failure', () => {
      expect(component.error).toBe('Failed to load requests. Please ensure the backend server is running.');
    });

    it('should set loading to false on error', () => {
      expect(component.loading).toBe(false);
    });

    it('should have empty requests array on error', () => {
      expect(component.requests).toEqual([]);
    });

    it('should display error message in template', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.error')?.textContent).toContain('Failed to load requests');
    });

    it('should not render request items on error', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const requestItems = compiled.querySelectorAll('app-request-item');
      expect(requestItems.length).toBe(0);
    });
  });

  describe('Empty state', () => {
    beforeEach(() => {
      requestServiceSpy.getAllRequests.and.returnValue(of([]));
      fixture = TestBed.createComponent(InboxComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should handle empty requests array', () => {
      expect(component.requests).toEqual([]);
      expect(component.loading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should display empty state message', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.empty')?.textContent).toContain('No requests found');
    });
  });

  describe('Sync time display', () => {
    beforeEach(() => {
      requestServiceSpy.getAllRequests.and.returnValue(of(mockRequests));
      fixture = TestBed.createComponent(InboxComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should display "Just now" for times less than 1 minute', () => {
      component.lastSyncTime = new Date();
      component['updateSyncTimeDisplay']();
      expect(component.syncTimeDisplay).toBe('Just now');
    });

    it('should display "1 min. ago" for exactly 1 minute', () => {
      component.lastSyncTime = new Date(Date.now() - 60000);
      component['updateSyncTimeDisplay']();
      expect(component.syncTimeDisplay).toBe('1 min. ago');
    });

    it('should display "X min. ago" for multiple minutes', () => {
      component.lastSyncTime = new Date(Date.now() - 5 * 60000);
      component['updateSyncTimeDisplay']();
      expect(component.syncTimeDisplay).toBe('5 min. ago');
    });

    it('should display empty string when lastSyncTime is null', () => {
      component.lastSyncTime = null;
      component['updateSyncTimeDisplay']();
      expect(component.syncTimeDisplay).toBe('');
    });
  });

  describe('Cleanup', () => {
    it('should clear interval on destroy', fakeAsync(() => {
      requestServiceSpy.getAllRequests.and.returnValue(of(mockRequests));
      fixture = TestBed.createComponent(InboxComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const clearIntervalSpy = spyOn(window, 'clearInterval');
      component.ngOnDestroy();

      expect(clearIntervalSpy).toHaveBeenCalled();
    }));
  });
});
