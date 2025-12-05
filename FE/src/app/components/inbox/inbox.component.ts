import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../services/request.service';
import { RequestItemComponent } from '../request-item/request-item.component';
import { InboxRequest } from '../../models/inbox-request.interface';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, RequestItemComponent],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css'
})
export class InboxComponent implements OnInit, OnDestroy {
  requests: InboxRequest[] = [];
  loading = true;
  error: string | null = null;
  lastSyncTime: Date | null = null;
  syncTimeDisplay = '';
  private syncTimeInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  ngOnDestroy(): void {
    if (this.syncTimeInterval) {
      clearInterval(this.syncTimeInterval);
    }
  }

  private loadRequests(): void {
    this.requestService.getAllRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
        this.lastSyncTime = new Date();
        this.updateSyncTimeDisplay();
        this.startSyncTimeUpdater();
      },
      error: (err) => {
        this.error = 'Failed to load requests. Please ensure the backend server is running.';
        this.loading = false;
        console.error('Error loading requests:', err);
      }
    });
  }

  private startSyncTimeUpdater(): void {
    if (this.syncTimeInterval) {
      clearInterval(this.syncTimeInterval);
    }
    this.syncTimeInterval = setInterval(() => this.updateSyncTimeDisplay(), 60000);
  }

  private updateSyncTimeDisplay(): void {
    if (!this.lastSyncTime) {
      this.syncTimeDisplay = '';
      return;
    }

    const now = new Date();
    const diffMs = now.getTime() - this.lastSyncTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) {
      this.syncTimeDisplay = 'Just now';
    } else if (diffMins === 1) {
      this.syncTimeDisplay = '1 min. ago';
    } else {
      this.syncTimeDisplay = `${diffMins} min. ago`;
    }
  }
}
