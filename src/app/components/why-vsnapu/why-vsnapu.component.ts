import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeddingContentService } from '../../services/wedding-content.service';

interface WhyCard {
  icon: string;
  title: string;
  desc: string;
  logoUrl?: string;
}

@Component({
  selector: 'app-why-vsnapu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-vsnapu.component.html',
  styleUrl: './why-vsnapu.component.css'
})
export class WhyVsnapuComponent implements OnInit {
  private contentService = inject(WeddingContentService);

  sectionTitle = signal('Why Choose VsnapU');
  sectionSub = signal('We don\'t just photograph weddings. We tell your story.');

  stats = signal([
    { value: '1,00,000+', label: 'Shoots Done' },
    { value: '100+', label: 'Cities' },
    { value: '2000+', label: 'Photographers' },
    { value: '300+', label: 'Weddings Covered' }
  ]);

  cards: WhyCard[] = [
    { icon: '📸', title: 'Artistic Vision', desc: 'Each frame is composed with intention — blending light, emotion, and narrative into timeless images.' },
    { icon: '🎬', title: 'Cinematic Films', desc: 'Our wedding films go beyond documentation — they are short films that capture the essence of your love.' },
    { icon: '', title: 'Shark Tank Featured', desc: 'Recognised on Shark Tank India — backed by investors who believe in transforming wedding photography across the country.', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Logo_of_Shark_Tank_India.png' },
    { icon: '🌏', title: 'Pan-India Coverage', desc: 'From intimate family gatherings to grand destination weddings across India, we travel for love.' },
    { icon: '⚡', title: 'Speedy Delivery', desc: 'Curated previews within 72 hours. Full albums and films delivered on schedule, every time.' },
    { icon: '🎨', title: 'Premium Albums', desc: 'Heirloom-quality photo books printed on fine art paper, designed to last generations.' }
  ];

  ngOnInit() {
    this.contentService.getAll().subscribe({
      next: c => {
        if (c['why.title']) this.sectionTitle.set(c['why.title']);
        if (c['why.subtitle']) this.sectionSub.set(c['why.subtitle']);
      },
      error: () => {}
    });
  }
}
