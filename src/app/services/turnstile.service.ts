import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../environments/environment';

interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TOKEN_TIMEOUT_MS = 60_000;

/**
 * Cloudflare Turnstile for the enquiry form. A widget is created per submit (tokens are single-use) and is
 * invisible unless Cloudflare decides the visitor needs a challenge. Returns '' when no site key is configured
 * (local dev), in which case the API skips verification too. The same service is used on all three VsnapU sites.
 */
@Injectable({ providedIn: 'root' })
export class TurnstileService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly siteKey: string = environment.turnstileSiteKey ?? '';
  private scriptLoaded?: Promise<void>;

  /** Resolves to a fresh single-use token, or '' when the captcha is not configured. Rejects if verification fails. */
  async getToken(): Promise<string> {
    if (!this.siteKey || !this.isBrowser) return '';
    await this.loadScript();

    return new Promise<string>((resolve, reject) => {
      const api = window.turnstile;
      if (!api) return reject(new Error('turnstile_unavailable'));

      // Fixed, centred slot: stays empty and invisible unless Cloudflare shows a challenge.
      const host = this.doc.createElement('div');
      host.setAttribute('style', 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483647;');
      this.doc.body.appendChild(host);

      let widgetId = '';
      const finish = (error?: Error, token?: string) => {
        clearTimeout(timer);
        try { if (widgetId) api.remove(widgetId); } catch { /* widget already gone */ }
        host.remove();
        error ? reject(error) : resolve(token ?? '');
      };
      const timer = setTimeout(() => finish(new Error('turnstile_timeout')), TOKEN_TIMEOUT_MS);

      widgetId = api.render(host, {
        sitekey: this.siteKey,
        appearance: 'interaction-only',
        callback: (token: string) => finish(undefined, token),
        'error-callback': () => finish(new Error('turnstile_error')),
        'timeout-callback': () => finish(new Error('turnstile_expired')),
      });
    });
  }

  private loadScript(): Promise<void> {
    if (window.turnstile) return Promise.resolve();
    this.scriptLoaded ??= new Promise<void>((resolve, reject) => {
      const el = this.doc.createElement('script');
      el.src = SCRIPT_SRC;
      el.async = true;
      el.onload = () => resolve();
      el.onerror = () => {
        this.scriptLoaded = undefined; // allow a retry on the next submit
        reject(new Error('turnstile_script_failed'));
      };
      this.doc.head.appendChild(el);
    });
    return this.scriptLoaded;
  }
}
