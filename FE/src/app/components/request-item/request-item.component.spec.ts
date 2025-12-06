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

    it('should display relative time in time badge', () => {
      component.request = createMockRequest();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const timeBadge = compiled.querySelector('.time-badge');
      expect(timeBadge).toBeTruthy();
      // Should contain relative time like "X min. ago" or similar
      expect(timeBadge?.textContent?.trim()).toBeTruthy();
    });

    it('should show absolute timestamp on hover (title attribute)', () => {
      component.request = createMockRequest();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const timeBadge = compiled.querySelector('.time-badge');
      expect(timeBadge?.getAttribute('title')).toMatch(/^\d{2}:\d{2} \d{2}\/\d{2}\/\d{4}$/);
    });
  });

  describe('Relative time formatting', () => {
    it('should return "Just now" for very recent times', () => {
      const now = new Date();
      component.request = createMockRequest({
        lastModifiedDate: now.toISOString(),
      });
      fixture.detectChanges();
      expect(component.relativeTime).toBe('Just now');
    });

    it('should return minutes ago for times under an hour', () => {
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
      component.request = createMockRequest({
        lastModifiedDate: thirtyMinsAgo.toISOString(),
      });
      fixture.detectChanges();
      expect(component.relativeTime).toBe('30 min. ago');
    });

    it('should return hours ago for times under a day', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
      component.request = createMockRequest({
        lastModifiedDate: threeHoursAgo.toISOString(),
      });
      fixture.detectChanges();
      expect(component.relativeTime).toBe('3 hr. ago');
    });
  });

  describe('Time age classes', () => {
    it('should return age-recent for times under 1 hour', () => {
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
      component.request = createMockRequest({
        lastModifiedDate: tenMinsAgo.toISOString(),
      });
      fixture.detectChanges();
      expect(component.timeAgeClass).toBe('age-recent');
    });

    it('should return age-today for times under 24 hours', () => {
      const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
      component.request = createMockRequest({
        lastModifiedDate: fiveHoursAgo.toISOString(),
      });
      fixture.detectChanges();
      expect(component.timeAgeClass).toBe('age-today');
    });

    it('should return age-aging for times 1-3 days old', () => {
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      component.request = createMockRequest({
        lastModifiedDate: twoDaysAgo.toISOString(),
      });
      fixture.detectChanges();
      expect(component.timeAgeClass).toBe('age-aging');
    });

    it('should return age-old for times over 3 days', () => {
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      component.request = createMockRequest({
        lastModifiedDate: fiveDaysAgo.toISOString(),
      });
      fixture.detectChanges();
      expect(component.timeAgeClass).toBe('age-old');
    });

    it('should apply age class to time badge in template', () => {
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
      component.request = createMockRequest({
        lastModifiedDate: tenMinsAgo.toISOString(),
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const timeBadge = compiled.querySelector('.time-badge');
      expect(timeBadge?.classList.contains('age-recent')).toBe(true);
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
      const metadataItems = compiled.querySelectorAll('.metadata-text');
      expect(metadataItems[0]?.textContent).toContain('3 min.');
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

    it('should display assigned clinician with avatar', () => {
      component.request = createMockRequest({
        assignment: { assignDate: '2025-06-08T11:01:47.567Z', assignedTo: 'Dr. Smith' },
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const doctorName = compiled.querySelector('.doctor-name');
      const doctorAvatar = compiled.querySelector('.doctor-avatar');
      expect(doctorName?.textContent).toContain('Dr. Smith');
      expect(doctorAvatar).toBeTruthy();
    });
  });

  describe('Doctor initials', () => {
    it('should extract initials from doctor name', () => {
      component.request = createMockRequest({
        assignment: { assignDate: '2025-06-08T11:01:47.567Z', assignedTo: 'Dr. John Smith' },
      });
      fixture.detectChanges();
      expect(component.doctorInitials).toBe('JS');
    });

    it('should handle names without Dr. prefix', () => {
      component.request = createMockRequest({
        assignment: { assignDate: '2025-06-08T11:01:47.567Z', assignedTo: 'Jane Doe' },
      });
      fixture.detectChanges();
      expect(component.doctorInitials).toBe('JD');
    });

    it('should handle single names', () => {
      component.request = createMockRequest({
        assignment: { assignDate: '2025-06-08T11:01:47.567Z', assignedTo: 'Johnson' },
      });
      fixture.detectChanges();
      expect(component.doctorInitials).toBe('JO');
    });

    it('should display initials in avatar', () => {
      component.request = createMockRequest({
        assignment: { assignDate: '2025-06-08T11:01:47.567Z', assignedTo: 'Dr. Johnson' },
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const avatar = compiled.querySelector('.doctor-avatar');
      expect(avatar?.textContent?.trim()).toBe('JO');
    });
  });

  describe('Read/Unread state', () => {
    it('should have unread class when isRead is false', () => {
      component.request = createMockRequest({ isRead: false });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const item = compiled.querySelector('.request-card');
      expect(item?.classList.contains('unread')).toBe(true);
    });

    it('should not have unread class when isRead is true', () => {
      component.request = createMockRequest({ isRead: true });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const item = compiled.querySelector('.request-card');
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

    it('should render panels badge in template for labReport', () => {
      component.request = createMockRequest({
        type: 'labReport',
        panels: ['CBC w/ auto diff'],
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const panelsBadge = compiled.querySelector('.panels-badge');
      const panelsCount = compiled.querySelector('.panels-count');
      expect(panelsBadge).toBeTruthy();
      expect(panelsCount?.textContent?.trim()).toBe('1');
    });

    it('should not render panels section for non-labReport types', () => {
      component.request = createMockRequest({
        type: 'freeText',
        panels: ['Should not show'],
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const panelsBadge = compiled.querySelector('.panels-badge');
      expect(panelsBadge).toBeNull();
    });

    it('should return correct panels count', () => {
      component.request = createMockRequest({
        type: 'labReport',
        panels: ['CBC', 'Lipid Panel', 'Metabolic Panel'],
      });
      fixture.detectChanges();
      expect(component.panelsCount).toBe(3);
    });

    it('should display plural label for multiple panels', () => {
      component.request = createMockRequest({
        type: 'labReport',
        panels: ['CBC', 'Lipid Panel'],
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const panelsLabel = compiled.querySelector('.panels-label');
      expect(panelsLabel?.textContent?.trim()).toBe('panels');
    });

    it('should display singular label for one panel', () => {
      component.request = createMockRequest({
        type: 'labReport',
        panels: ['CBC'],
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const panelsLabel = compiled.querySelector('.panels-label');
      expect(panelsLabel?.textContent?.trim()).toBe('panel');
    });
  });

  describe('Priority classes', () => {
    it('should return priority-urgent for urgent requests', () => {
      component.request = createMockRequest({ isUrgent: true });
      fixture.detectChanges();
      expect(component.priorityClass).toBe('priority-urgent');
    });

    it('should return priority-attention for requests with abnormal results', () => {
      component.request = createMockRequest({
        isUrgent: false,
        abnormalResults: ['High glucose'],
      });
      fixture.detectChanges();
      expect(component.priorityClass).toBe('priority-attention');
    });

    it('should return priority-routine for normal requests', () => {
      component.request = createMockRequest({
        isUrgent: false,
        abnormalResults: [],
      });
      fixture.detectChanges();
      expect(component.priorityClass).toBe('priority-routine');
    });

    it('should prioritize urgent over abnormal results', () => {
      component.request = createMockRequest({
        isUrgent: true,
        abnormalResults: ['High glucose'],
      });
      fixture.detectChanges();
      expect(component.priorityClass).toBe('priority-urgent');
    });

    it('should apply priority class to template', () => {
      component.request = createMockRequest({ isUrgent: true });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const item = compiled.querySelector('.request-card');
      expect(item?.classList.contains('priority-urgent')).toBe(true);
    });
  });

  describe('Priority badges', () => {
    it('should return urgent badge class for urgent requests', () => {
      component.request = createMockRequest({ isUrgent: true });
      fixture.detectChanges();
      expect(component.priorityBadgeClass).toBe('urgent');
      expect(component.priorityLabel).toBe('Urgent');
    });

    it('should return attention badge class for abnormal results', () => {
      component.request = createMockRequest({
        isUrgent: false,
        abnormalResults: ['High glucose'],
      });
      fixture.detectChanges();
      expect(component.priorityBadgeClass).toBe('attention');
      expect(component.priorityLabel).toBe('Attention');
    });

    it('should return empty badge class for routine requests', () => {
      component.request = createMockRequest({
        isUrgent: false,
        abnormalResults: [],
      });
      fixture.detectChanges();
      expect(component.priorityBadgeClass).toBe('');
      expect(component.priorityLabel).toBe('');
    });
  });

  describe('Alerts section', () => {
    it('should show alerts section for urgent requests', () => {
      component.request = createMockRequest({ isUrgent: true });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const alertsSection = compiled.querySelector('.alerts-section');
      expect(alertsSection).toBeTruthy();
      const urgentAlert = compiled.querySelector('.alert-badge.urgent');
      expect(urgentAlert).toBeTruthy();
      expect(urgentAlert?.textContent).toContain('Urgent');
    });

    it('should show alerts section for abnormal results', () => {
      component.request = createMockRequest({
        isUrgent: false,
        abnormalResults: ['High glucose', 'Low iron'],
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const alertsSection = compiled.querySelector('.alerts-section');
      expect(alertsSection).toBeTruthy();
      const attentionAlert = compiled.querySelector('.alert-badge.attention');
      expect(attentionAlert).toBeTruthy();
      expect(attentionAlert?.textContent).toContain('High glucose, Low iron');
    });

    it('should not show alerts section for routine requests', () => {
      component.request = createMockRequest({
        isUrgent: false,
        abnormalResults: [],
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const alertsSection = compiled.querySelector('.alerts-section');
      expect(alertsSection).toBeNull();
    });

    it('should show both urgent and abnormal alerts when both present', () => {
      component.request = createMockRequest({
        isUrgent: true,
        abnormalResults: ['High glucose'],
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const urgentAlert = compiled.querySelector('.alert-badge.urgent');
      const attentionAlert = compiled.querySelector('.alert-badge.attention');
      expect(urgentAlert).toBeTruthy();
      expect(attentionAlert).toBeTruthy();
    });
  });

  describe('hasAlerts getter', () => {
    it('should return true for urgent requests', () => {
      component.request = createMockRequest({ isUrgent: true });
      fixture.detectChanges();
      expect(component.hasAlerts).toBe(true);
    });

    it('should return true for requests with abnormal results', () => {
      component.request = createMockRequest({
        isUrgent: false,
        abnormalResults: ['High glucose'],
      });
      fixture.detectChanges();
      expect(component.hasAlerts).toBe(true);
    });

    it('should return false for routine requests', () => {
      component.request = createMockRequest({
        isUrgent: false,
        abnormalResults: [],
      });
      fixture.detectChanges();
      expect(component.hasAlerts).toBe(false);
    });
  });

  describe('Type classes', () => {
    it('should return type-renewal for renewal type', () => {
      component.request = createMockRequest({ type: 'renewal' });
      fixture.detectChanges();
      expect(component.typeClass).toBe('type-renewal');
    });

    it('should return type-labReport for labReport type', () => {
      component.request = createMockRequest({ type: 'labReport' });
      fixture.detectChanges();
      expect(component.typeClass).toBe('type-labReport');
    });

    it('should return type-freeText for freeText type', () => {
      component.request = createMockRequest({ type: 'freeText' });
      fixture.detectChanges();
      expect(component.typeClass).toBe('type-freeText');
    });

    it('should apply type class to template', () => {
      component.request = createMockRequest({ type: 'labReport' });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const item = compiled.querySelector('.request-card');
      expect(item?.classList.contains('type-labReport')).toBe(true);
    });

    it('should apply type class to icon container', () => {
      component.request = createMockRequest({ type: 'labReport' });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const iconContainer = compiled.querySelector('.type-icon-container');
      expect(iconContainer?.classList.contains('labReport')).toBe(true);
    });
  });

  describe('Category labels', () => {
    it('should return Medication for renewal type', () => {
      component.request = createMockRequest({ type: 'renewal' });
      fixture.detectChanges();
      expect(component.categoryLabel).toBe('Medication');
    });

    it('should return Lab Results for labReport type', () => {
      component.request = createMockRequest({ type: 'labReport' });
      fixture.detectChanges();
      expect(component.categoryLabel).toBe('Lab Results');
    });

    it('should return Message for freeText type', () => {
      component.request = createMockRequest({ type: 'freeText' });
      fixture.detectChanges();
      expect(component.categoryLabel).toBe('Message');
    });

    it('should return correct category class for renewal', () => {
      component.request = createMockRequest({ type: 'renewal' });
      fixture.detectChanges();
      expect(component.categoryClass).toBe('category-renewal');
    });

    it('should return correct category class for labReport', () => {
      component.request = createMockRequest({ type: 'labReport' });
      fixture.detectChanges();
      expect(component.categoryClass).toBe('category-labReport');
    });

    it('should render category chip in template', () => {
      component.request = createMockRequest({ type: 'renewal' });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const chip = compiled.querySelector('.category-chip');
      expect(chip).toBeTruthy();
      expect(chip?.textContent?.trim()).toBe('Medication');
      expect(chip?.classList.contains('category-renewal')).toBe(true);
    });

    it('should render labReport category chip with correct styling', () => {
      component.request = createMockRequest({ type: 'labReport' });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const chip = compiled.querySelector('.category-chip');
      expect(chip?.textContent?.trim()).toBe('Lab Results');
      expect(chip?.classList.contains('category-labReport')).toBe(true);
    });
  });
});
