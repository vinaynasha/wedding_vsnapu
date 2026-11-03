import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeddingContentService {
  private readonly url = `${environment.apiBaseUrl}/api/WeddingPageContent`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(this.url);
  }
}
