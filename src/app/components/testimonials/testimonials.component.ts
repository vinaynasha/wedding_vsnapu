import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeddingTestimonial } from '../../models/wedding.models';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  activeIndex = signal(0);
  private timer: ReturnType<typeof setInterval> | null = null;

  testimonials: WeddingTestimonial[] = [
    {
      id: 1,
      clientName: 'Priya & Arjun',
      quote: 'VsnapU captured every emotion of our wedding day so beautifully. We relive those moments every time we open our album. Truly world-class work.',
      eventType: 'Wedding',
      location: 'Jaipur'
    },
    {
      id: 2,
      clientName: 'Meera & Karan',
      quote: 'The pre-wedding shoot was absolutely magical. They found the most stunning locations and made us feel so comfortable in front of the camera.',
      eventType: 'Pre-Wedding Shoot',
      location: 'Udaipur'
    },
    {
      id: 3,
      clientName: 'Sneha & Rohit',
      quote: 'From booking to delivery, the entire experience was seamless. Our wedding film made our entire family cry with joy. Worth every rupee.',
      eventType: 'Wedding Cinematography',
      location: 'Mumbai'
    },
    {
      id: 4,
      clientName: 'Ananya & Vikram',
      quote: 'What stood out was how unobtrusive they were during the ceremony, yet they caught every single candid moment perfectly. Absolute professionals.',
      eventType: 'Wedding',
      location: 'Delhi'
    }
  ];

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  goTo(index: number): void {
    this.activeIndex.set(index);
    this.restartAutoPlay();
  }

  prev(): void {
    const next = (this.activeIndex() - 1 + this.testimonials.length) % this.testimonials.length;
    this.goTo(next);
  }

  next(): void {
    const next = (this.activeIndex() + 1) % this.testimonials.length;
    this.goTo(next);
  }

  private startAutoPlay(): void {
    this.timer = setInterval(() => this.next(), 5000);
  }

  private stopAutoPlay(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private restartAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
