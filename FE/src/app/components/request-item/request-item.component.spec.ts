import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestItemComponent } from './request-item.component';
import { InboxRequest } from '../../models/inbox-request.interface';

describe('RequestItemComponent', () => {
  let component: RequestItemComponent;
  let fixture: ComponentFixture<RequestItemComponent>;

  const createMockRequest = (overrides: Partial<InboxRequest> = {}): InboxRequest => ({
    type: 'renewal',
    id: '1',
    status: 'new',
    isRead: false,
    patientName: 'John Smith',
    requestDate: '2025-06-08T00:00:00.000Z',
    lastModifiedDate: '2025-06-08T11:01:47.567Z',
    description: 'Test description',
    estimatedTimeSec: 151,
    assignment: {
      assignDate: '2025-06-08T11:01:47.567Z',
      assignedTo: 'Dr. Johnson',
    },
    isUrgent: false,
    ...overrides,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestItemComponent);
    component = fixture.componentInstance;
  });

  describe('Component creation', () => {
    it('should create', () => {
      component.request = createMockRequest();
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });
  });

  describe('Icon mapping', () => {
    it('should return renewal icon for renewal type', () => {
      component.request = createMockRequest({ type: 'renewal' });
      fixture.detectChanges();
      expect(component.typeIcon).toBe('assets/icons/medicine.svg');
    });

    it('should return freeText icon for freeText type', () => {
      component.request = createMockRequest({ type: 'freeText' });
      fixture.detectChanges();
      expect(component.typeIcon).toBe('assets/icons/message.svg');
    });

    it('should return labReport icon for labReport type', () => {
      component.request = createMockRequest({ type: 'labReport' });
      fixture.detectChanges();
      expect(component.typeIcon).toBe('assets/icons/icon_labs.svg');
    });

    it('should render the correct icon in template', () => {
      component.request = createMockRequest({ type: 'renewal' });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const icon = compiled.querySelector('.type-icon') as HTMLImageElement;
      expect(icon.src).toContain('medicine.svg');
    });
  });

  describe('Timestamp formatting', () => {
    it('should format timestamp as HH:mm DD/MM/YYYY', () => {
      component.request = createMockRequest({
        lastModifiedDate: '2025-06-08T11:01:47.567Z',
      });
      fixture.detectChanges();

      const formatted = component.formattedTimestamp;
      expect(formatted).toMatch(/^\d{2}:\d{2} \d{2}\/\d{2}\/\d{4}$/);
    });

    it('should display timestamp in template', () => {
      component.request = createMockRequest();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const timestamp = compiled.querySelector('.timestamp');
      expect(timestamp?.textContent).toMatch(/^\d{2}:\d{2} \d{2}\/\d{2}\/\d{4}$/);
    });
  });

  describe('Estimated time formatting', () => {
    it('should display seconds for values under 60', () => {
      component.request = createMockRequest({ estimatedTimeSec: 45 });
      fixture.detectChanges();
      expect(component.estimatedTime).toBe('45 sec.');
    });

    it('should display minutes for values 60-1199', () => {
      component.request = createMockRequest({ estimatedTimeSec: 120 });
      fixture.detectChanges();
      expect(component.estimatedTime).toBe('2 min.');
    });

    it('should round minutes correctly', () => {
      component.request = createMockRequest({ estimatedTimeSec: 90 });
      fixture.detectChanges();
      expect(component.estimatedTime).toBe('2 min.');
    });

    it('should display X+ min for values >= 1200', () => {
      component.request = createMockRequest({ estimatedTimeSec: 1200 });
      fixture.detectChanges();
      expect(component.estimatedTime).toBe('20+ min.');
    });

    it('should display X+ min for large values', () => {
      component.request = createMockRequest({ estimatedTimeSec: 1863 });
      fixture.detectChanges();
      expect(component.estimatedTime).toBe('31+ min.');
    });

    it('should render estimated time in template', () => {
      component.request = createMockRequest({ estimatedTimeSec: 151 });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const time = compiled.querySelector('.estimated-time');
      expect(time?.textContent).toContain('3 min.');
    });
  });

  describe('Patient info rendering', () => {
    it('should display patient name', () => {
      component.request = createMockRequest({ patientName: 'Jane Doe' });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const name = compiled.querySelector('.patient-name');
      expect(name?.textContent).toContain('Jane Doe');
    });

    it('should display description', () => {
      component.request = createMockRequest({ description: 'Test description content' });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const description = compiled.querySelector('.request-description');
      expect(description?.textContent).toContain('Test description content');
    });

    it('should display assigned clinician', () => {
      component.request = createMockRequest({
        assignment: { assignDate: '2025-06-08T11:01:47.567Z', assignedTo: 'Dr. Smith' },
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const assigned = compiled.querySelector('.assigned-to');
      expect(assigned?.textContent).toContain('Dr. Smith');
    });
  });

  describe('Read/Unread state', () => {
    it('should have unread class when isRead is false', () => {
      component.request = createMockRequest({ isRead: false });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const item = compiled.querySelector('.request-item');
      expect(item?.classList.contains('unread')).toBe(true);
    });

    it('should not have unread class when isRead is true', () => {
      component.request = createMockRequest({ isRead: true });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const item = compiled.querySelector('.request-item');
      expect(item?.classList.contains('unread')).toBe(false);
    });
  });

  describe('Labels rendering', () => {
    it('should display labels when present', () => {
      component.request = createMockRequest({
        type: 'freeText',
        labels: ['Rx', 'Clinical'],
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const labels = compiled.querySelectorAll('.label');
      expect(labels.length).toBe(2);
      expect(labels[0].textContent).toContain('Rx');
      expect(labels[1].textContent).toContain('Clinical');
    });

    it('should not display labels section when labels are empty', () => {
      component.request = createMockRequest({ labels: [] });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const labels = compiled.querySelectorAll('.label');
      expect(labels.length).toBe(0);
    });

    it('should not display labels section when labels are undefined', () => {
      component.request = createMockRequest();
      delete (component.request as Partial<InboxRequest>).labels;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const labels = compiled.querySelectorAll('.label');
      expect(labels.length).toBe(0);
    });
  });

  describe('Panels rendering (labReport)', () => {
    it('should display panels for labReport type', () => {
      component.request = createMockRequest({
        type: 'labReport',
        panels: ['CBC', 'Lipid Panel'],
      });
      fixture.detectChanges();
      expect(component.panelsDisplay).toBe('CBC, Lipid Panel');
    });

    it('should return empty string when no panels', () => {
      component.request = createMockRequest({ type: 'labReport', panels: [] });
      fixture.detectChanges();
      expect(component.panelsDisplay).toBe('');
    });

    it('should return empty string when panels undefined', () => {
      component.request = createMockRequest({ type: 'labReport' });
      delete (component.request as Partial<InboxRequest>).panels;
      fixture.detectChanges();
      expect(component.panelsDisplay).toBe('');
    });

    it('should render panels info in template for labReport', () => {
      component.request = createMockRequest({
        type: 'labReport',
        panels: ['CBC w/ auto diff'],
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const panelsInfo = compiled.querySelector('.panels-info');
      expect(panelsInfo?.textContent).toContain('CBC w/ auto diff');
    });

    it('should not render panels section for non-labReport types', () => {
      component.request = createMockRequest({
        type: 'freeText',
        panels: ['Should not show'],
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const panelsInfo = compiled.querySelector('.panels-info');
      expect(panelsInfo).toBeNull();
    });
  });
});
