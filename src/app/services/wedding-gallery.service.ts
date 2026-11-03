import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeddingGalleryItem } from '../models/wedding.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WeddingGalleryService {
  private readonly url = `${environment.apiBaseUrl}/api/WeddingGallery`;

  constructor(private http: HttpClient) {}

  getActiveItems(): Observable<WeddingGalleryItem[]> {
    return this.http.get<WeddingGalleryItem[]>(this.url);
  }
}
