import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WeddingEnquiryService } from '../../services/wedding-enquiry.service';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const GENERIC_ERROR = 'Something went wrong — please try again.';

@Component({
  selector: 'app-enquiry-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enquiry-modal.component.html',
  styleUrl: './enquiry-modal.component.css'
})
export class EnquiryModalComponent {
  private fb = inject(FormBuilder);
  private enquiryService = inject(WeddingEnquiryService);

  isOpen = signal(false);
  formState = signal<FormState>('idle');

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    contact: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    eventType: ['Wedding'],
    weddingDate: [''],
    website: ['']  // honeypot
  });

  errorMessage = signal(GENERIC_ERROR);

  eventTypes = ['Wedding', 'Pre-Wedding Shoot', 'Reception', 'Engagement'];

  get nameInvalid() { const c = this.form.get('name'); return !!(c?.invalid && c.touched); }
  get contactInvalid() { const c = this.form.get('contact'); return !!(c?.invalid && c.touched); }

  open() { this.isOpen.set(true); document.body.style.overflow = 'hidden'; }
  close() { this.isOpen.set(false); document.body.style.overflow = ''; }

  submit() {
    if (this.form.invalid || this.formState() === 'submitting') {
      this.form.markAllAsTouched();
      return;
    }
    this.formState.set('submitting');
    if (this.form.value.website) return; // honeypot
    const { name, contact, eventType, weddingDate } = this.form.value;
    this.enquiryService.submit({
      name: name!,
      contact: contact!,
      eventType: eventType ?? undefined,
      weddingDate: weddingDate || undefined,
      pageName: 'weddings.vsnapu.com'
    }).subscribe({
      next: () => { this.formState.set('success'); this.form.reset({ eventType: 'Wedding' }); },
      error: (err) => {
        // Show the server's reason (bad mobile, captcha, too many requests) when it sent one.
        const message = err?.error?.message;
        this.errorMessage.set(typeof message === 'string' && message ? message : GENERIC_ERROR);
        this.formState.set('error');
      }
    });
  }
}
