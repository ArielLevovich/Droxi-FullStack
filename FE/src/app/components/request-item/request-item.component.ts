import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxRequest, RequestType } from '../../models/inbox-request.interface';

@Component({
  selector: 'app-request-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-item.component.html',
  styleUrl: './request-item.component.css'
})
export class RequestItemComponent {
  @Input({ required: true }) request!: InboxRequest;

  private readonly iconMap: Record<RequestType, string> = {
    labReport: 'assets/icons/icon_labs.svg',
    renewal: 'assets/icons/medicine.svg',
    freeText: 'assets/icons/message.svg'
  };

  get typeIcon(): string {
    return this.iconMap[this.request.type] || 'assets/icons/icon-unknown.svg';
  }

  get priorityClass(): string {
    if (this.request.isUrgent) return 'priority-urgent';
    if (this.request.abnormalResults?.length) return 'priority-attention';
    return 'priority-routine';
  }

  get priorityBadgeClass(): string {
    if (this.request.isUrgent) return 'urgent';
    if (this.request.abnormalResults?.length) return 'attention';
    return '';
  }

  get priorityLabel(): string {
    if (this.request.isUrgent) return 'Urgent';
    if (this.request.abnormalResults?.length) return 'Attention';
    return '';
  }

  get typeClass(): string {
    return `type-${this.request.type}`;
  }

  get categoryLabel(): string {
    const labels: Record<RequestType, string> = {
      renewal: 'Medication',
      labReport: 'Lab Results',
      freeText: 'Message'
    };
    return labels[this.request.type] || 'Request';
  }

  get categoryClass(): string {
    return `category-${this.request.type}`;
  }

  get hasAlerts(): boolean {
    return !!(this.request.abnormalResults?.length || this.request.isUrgent);
  }

  get formattedTimestamp(): string {
    const date = new Date(this.request.lastModifiedDate);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  get relativeTime(): string {
    const now = new Date();
    const date = new Date(this.request.lastModifiedDate);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min. ago`;
    if (diffHours < 24) return `${diffHours} hr. ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} wk. ago`;
  }

  get timeAgeClass(): string {
    const now = new Date();
    const date = new Date(this.request.lastModifiedDate);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) return 'age-recent';
    if (diffHours < 24) return 'age-today';
    if (diffHours < 72) return 'age-aging';
    return 'age-old';
  }

  get doctorInitials(): string {
    const name = this.request.assignment.assignedTo;
    const parts = name.replace(/^(Dr\.|Dr|MD|M\.D\.)\s*/i, '').trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0]?.substring(0, 2).toUpperCase() || '??';
  }

  get panelsCount(): number {
    return this.request.panels?.length || 0;
  }

  get estimatedTime(): string {
    const seconds = this.request.estimatedTimeSec;
    if (seconds >= 1200) {
      const mins = Math.floor(seconds / 60);
      return `${mins}+ min.`;
    } else if (seconds >= 60) {
      const mins = Math.round(seconds / 60);
      return `${mins} min.`;
    } else {
      return `${seconds} sec.`;
    }
  }

  get panelsDisplay(): string {
    if (!this.request.panels || this.request.panels.length === 0) {
      return '';
    }
    return this.request.panels.join(', ');
  }

  get descriptionLines(): string[] {
    if (!this.request.description) {
      return [];
    }
    // Split by date pattern [MM/DD/YY] but keep the delimiter with each part
    const parts = this.request.description.split(/(?=\[\d{2}\/\d{2}\/\d{2}\])/);
    return parts.map(part => part.trim()).filter(part => part.length > 0);
  }

  get abnormalResultsDisplay(): string {
    if (!this.request.abnormalResults || this.request.abnormalResults.length === 0) {
      return '';
    }
    return this.request.abnormalResults.join(', ');
  }
}
