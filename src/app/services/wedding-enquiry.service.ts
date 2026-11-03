import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { WeddingEnquiryRequest } from '../models/wedding.models';
import { environment } from '../../environments/environment';
import { TurnstileService } from './turnstile.service';

@Injectable({ providedIn: 'root' })
export class WeddingEnquiryService {
  private readonly url = `${environment.apiBaseUrl}/api/WeddingEnquiries`;

  constructor(private http: HttpClient, private turnstile: TurnstileService) {}

  /** Fetches a Turnstile token first, so the form is captcha-protected. */
  submit(request: Omit<WeddingEnquiryRequest, 'captchaToken'>): Observable<unknown> {
    return from(this.turnstile.getToken()).pipe(
      switchMap((captchaToken) =>
        this.http.post(this.url, { ...request, captchaToken }, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }))
    );
  }
}
