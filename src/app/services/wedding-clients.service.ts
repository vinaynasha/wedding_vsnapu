import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeddingClient } from '../models/wedding.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeddingClientsService {
  private readonly url = `${environment.apiBaseUrl}/api/WeddingClients`;

  constructor(private http: HttpClient) {}

  getActive(): Observable<WeddingClient[]> {
    return this.http.get<WeddingClient[]>(this.url);
  }
}
