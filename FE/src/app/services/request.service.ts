import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InboxRequest } from '../models/inbox-request.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private readonly apiUrl = `${environment.apiUrl}/requests`;

  constructor(private http: HttpClient) {}

  getAllRequests(): Observable<InboxRequest[]> {
    return this.http.get<InboxRequest[]>(this.apiUrl);
  }

  getRequestById(id: string): Observable<InboxRequest> {
    return this.http.get<InboxRequest>(`${this.apiUrl}/${id}`);
  }
}
