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

  get formattedTimestamp(): string {
    const date = new Date(this.request.lastModifiedDate);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
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
}
