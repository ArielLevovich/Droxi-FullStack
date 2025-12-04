import { Component, OnInit } from '@angular/core';
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
export class InboxComponent implements OnInit {
  requests: InboxRequest[] = [];
  loading = true;
  error: string | null = null;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  private loadRequests(): void {
    this.requestService.getAllRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load requests. Please ensure the backend server is running.';
        this.loading = false;
        console.error('Error loading requests:', err);
      }
    });
  }
}
